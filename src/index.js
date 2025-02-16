const express = require('express'); // Импортируем библиотеку Express для создания сервера
const bodyParser = require('body-parser'); // Импортируем middleware для парсинга тела запроса
const dotenv = require('dotenv'); // Импортируем библиотеку для работы с переменными окружения
const cors = require('cors'); // Импортируем библиотеку CORS
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const fs = require('fs'); // Импортируем библиотеку для работы с файловой системой
const path = require('path'); // Импортируем библиотеку для работы с путями
const jwt = require('jsonwebtoken'); // Импортируем библиотеку для работы с JWT

dotenv.config(); // Загружаем переменные окружения из .env файла

const app = express(); // Создаем экземпляр приложения Express
const PORT = process.env.PORT || 3000; // Устанавливаем порт для сервера

app.use(cors()); // Включаем CORS
app.use(bodyParser.json({ limit: '1mb' })); // Устанавливаем максимальный размер входных данных в 1MB

// Функция для генерации HTML из данных
function generateHTML(cv_data, template_id) {
    const templatePath = path.join(__dirname, 'templates', `template${template_id}.html`); // Укажите путь к вашему HTML-шаблону
    let template = fs.readFileSync(templatePath, 'utf8');

    // Замена маркеров в HTML на данные из cv_data
    template = template
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

    return template; // Возвращаем сгенерированный HTML
}

// Middleware для проверки JWT
function authenticateToken(req, res, next) {
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
        next(); // Переходим к следующему middleware или обработчику
    });
}

// Эндпоинт для генерации PDF
app.post('/api/v1/generate', authenticateToken, async (req, res) => {
    const { cv_data, template_id } = req.body;
    if (!cv_data) {
        return res.status(400).json({ error: 'Bad Request', message: 'cv_data is required' });
    }

    try {
        const html = generateHTML(cv_data, template_id);

        // Updated browser launch configuration
        const options = process.env.AWS_LAMBDA_FUNCTION_VERSION
            ? {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            }
            : {
                args: [],
                executablePath: process.platform === 'win32'
                    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                    : process.platform === 'linux'
                    ? '/usr/bin/google-chrome'
                    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                headless: true,
            };

        const browser = await puppeteer.launch(options);

        const page = await browser.newPage();
        
        // Устанавливаем содержимое страницы
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        // Генерируем PDF
        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        // Отправляем PDF клиенту
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: 'Failed to generate PDF'
        });
    }
});

// Эндпоинт для получения списка шаблонов с проверкой JWT
app.get('/api/v1/templates', authenticateToken, (req, res) => {
    const templates = [
        {
            id: 1,
            name: "Шаблон 1",
            description: "Описание шаблона 1"
        },
        {
            id: 2,
            name: "Шаблон 2",
            description: "Описание шаблона 2"
        }
    ];
    res.status(200).json({ templates }); // Возвращаем массив шаблонов
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); // Выводим сообщение о запуске сервера
});