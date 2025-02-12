const express = require('express'); // Импортируем библиотеку Express для создания сервера
const bodyParser = require('body-parser'); // Импортируем middleware для парсинга тела запроса
const dotenv = require('dotenv'); // Импортируем библиотеку для работы с переменными окружения
const cors = require('cors'); // Импортируем библиотеку CORS
const pdf = require('html-pdf'); // Импортируем библиотеку для генерации PDF
const fs = require('fs'); // Импортируем библиотеку для работы с файловой системой
const path = require('path'); // Импортируем библиотеку для работы с путями
const jwt = require('jsonwebtoken'); // Импортируем библиотеку для работы с JWT

dotenv.config(); // Загружаем переменные окружения из .env файла

const app = express(); // Создаем экземпляр приложения Express
const PORT = process.env.PORT || 3000; // Устанавливаем порт для сервера

app.use(cors()); // Включаем CORS
app.use(bodyParser.json({ limit: '1mb' })); // Устанавливаем максимальный размер входных данных в 1MB

// Эндпоинт для генерации PDF
app.post('/api/v1/generate', (req, res) => {
    const authHeader = req.headers['authorization']; // Получаем заголовок авторизации
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен

    if (!token) {
        return res.sendStatus(401); // Если токен отсутствует, возвращаем 401
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Если токен недействителен, возвращаем 403
        }
        req.user = user; // Сохраняем информацию о пользователе в запросе

    const { template_id, cv_data } = req.body; // Извлекаем template_id и cv_data из тела запроса
        if (!cv_data) {
            return res.status(400).json({ error: 'Bad Request', message: 'cv_data is required' });
        }

        let templatePath;
        switch (template_id) {
            case 1:
                templatePath = path.join(__dirname, 'templates', 'template1.html');
                break;
            case 2:
                templatePath = path.join(__dirname, 'templates', 'template2.html');
                break;
            default:
                return res.status(400).json({ error: 'Bad Request', message: 'Invalid template_id' });
        }

        const template = fs.readFileSync(templatePath, 'utf8');
        let html = template
            .replace(/markernamemarker/g, cv_data.personal.full_name)
            .replace(/markeremailmarker/g, cv_data.personal.email)
            .replace(/markerphonemarker/g, cv_data.personal.phone)
            .replace(/markerlocationmarker/g, cv_data.personal.location)
            .replace(/markerphotomarker/g, cv_data.personal.photo)
            .replace(/markerexperiencemarker/g, cv_data.experience.map(job => `
                <h3>${job.position} - ${job.company}</h3>
                <p>${job.start_date} - ${job.end_date}</p>
                <p>${job.description}</p>
            `).join(''))
            .replace(/markereducationmarker/g, cv_data.education.map(edu => `
                <h3>${edu.degree} - ${edu.institution}</h3>
                <p>Год выпуска: ${edu.graduation_year}</p>
            `).join(''))
            .replace(/markerskillsmarker/g, cv_data.skills.join(', '))
            .replace(/markerlanguagesmarker/g, cv_data.languages.map(lang => `${lang.name} (${lang.level})`).join(', '));

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            },
            quality: '100',
            type: 'pdf',
            height: '842px',
            width: '595px',
            renderDelay: 2000,
            zoomFactor: 1,
            localUrlAccess: true,
            pdfOptions: {
                printBackground: true,
                preferCSSPageSize: true,
                margin: {
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0'
                },
                scale: 1.0
            }
        };

        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Ошибка при создании PDF:', err);
                return res.status(500).json({ error: 'Internal Server Error', message: err.message });
            }

            const cleanFileName = cv_data.personal.full_name.replace(/[^a-zA-Z0-9-_\.]/g, '_');
            const filename = `resume_${cleanFileName}.pdf`;
            
            res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
            res.setHeader('Content-type', 'application/pdf');
            res.send(buffer);
        });
    });
});

// Эндпоинт для получения списка шаблонов
app.get('/api/v1/templates', (req, res) => {
    const authHeader = req.headers['authorization']; // Получаем заголовок авторизации
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен

    if (!token) {
        return res.sendStatus(401); // Если токен отсутствует, возвращаем 401
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Если токен недействителен, возвращаем 403
        }
        req.user = user; // Сохраняем информацию о пользователе в запросе

        const templates = [
            { id: 1, name: 'Шаблон 1', description: 'Описание шаблона 1' },
            { id: 2, name: 'Шаблон 2', description: 'Описание шаблона 2' }
        ];

        res.status(200).json({ templates });
    });
});

// Эндпоинт для тестирования шаблона (админ)
app.post('/api/v1/test', (req, res) => {
    const adminApiKey = req.headers['x-api-key'];
    if (!adminApiKey || adminApiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
    }

    const { template_id } = req.body;
    if (!template_id) {
        return res.status(400).json({ error: 'Bad Request', message: 'template_id is required' });
    }

    // Логика тестирования шаблона
    res.status(200).json({ message: 'Template tested successfully' });
});

// Эндпоинт для удаления шаблона (админ)
app.delete('/api/v1/templates/:templateId', (req, res) => {
    const adminApiKey = req.headers['x-api-key'];
    if (!adminApiKey || adminApiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
    }

    const { templateId } = req.params;
    // Логика удаления шаблона
    res.status(204).send(); // Успешное удаление
});

// Эндпоинт для добавления шаблона (админ)
app.post('/api/v1/templates', (req, res) => {
    const adminApiKey = req.headers['x-api-key'];
    if (!adminApiKey || adminApiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
    }

    const { name, description, template_file } = req.body; // Предполагается, что файл передается в теле запроса
    // Логика добавления шаблона
    res.status(201).json({ id: 3, name, description, created_at: new Date().toISOString() }); // Пример ответа
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); // Выводим сообщение о запуске сервера
});