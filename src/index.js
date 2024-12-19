const express = require('express'); // Импортируем библиотеку Express для создания сервера
const bodyParser = require('body-parser'); // Импортируем middleware для парсинга тела запроса
const dotenv = require('dotenv'); // Импортируем библиотеку для работы с переменными окружения
const PDFDocument = require('pdfkit'); // Импортируем библиотеку для генерации PDF
const generateTemplate1 = require('./templates/template1'); // Импортируем первый шаблон
const generateTemplate2 = require('./templates/template2'); // Импортируем второй шаблон
const generateTemplate3 = require('./templates/template3'); // Импортируем третий шаблон
const { PassThrough } = require('stream'); // Импортируем PassThrough для работы с потоками

dotenv.config(); // Загружаем переменные окружения из .env файла

const app = express(); // Создаем экземпляр приложения Express
const PORT = process.env.PORT || 3000; // Устанавливаем порт для сервера
const API_KEY = process.env.API_KEY; // Получаем API ключ из переменных окружения

app.use(bodyParser.json({ limit: '1mb' })); // Устанавливаем максимальный размер входных данных в 1MB

// Обработка POST-запроса для генерации резюме
app.post('/api/v1/generate', (req, res) => {
    const authHeader = req.headers['authorization']; // Получаем заголовок авторизации
    // Проверяем наличие и корректность API ключа
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' }); // Возвращаем ошибку 401, если ключ неверный
    }

    const { template_id, cv_data } = req.body; // Извлекаем template_id и cv_data из тела запроса

    // Проверяем, что template_id и cv_data присутствуют
    if (!template_id || !cv_data) {
        return res.status(400).json({ error: 'Bad Request', message: 'template_id and cv_data are required' }); // Возвращаем ошибку 400, если данные отсутствуют
    }

    const doc = new PDFDocument(); // Создаем новый документ PDF
    let filename = `resume_${cv_data.personal.full_name.replace(/\s+/g, '_')}.pdf`; // Формируем имя файла на основе полного имени
    filename = filename.replace(/[^a-zA-Z0-9_\.]/g, ''); // Удаляем недопустимые символы из имени файла

    // Устанавливаем заголовки для ответа
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"'); // Указываем, что файл будет загружен
    res.setHeader('Content-type', 'application/pdf'); // Указываем тип содержимого

    // Обработка шаблонов в зависимости от template_id
    const passThrough = new PassThrough(); // Создаем поток для PDF
    doc.pipe(passThrough); // Подключаем поток к документу

    try {
        switch (template_id) {
            case 1:
                generateTemplate1(doc, cv_data); // Генерируем резюме по первому шаблону
                break;
            case 2:
                generateTemplate2(doc, cv_data); // Генерируем резюме по второму шаблону
                break;
            case 3:
                generateTemplate3(doc, cv_data); // Генерируем резюме по третьему шаблону
                break;
            default:
                return res.status(400).json({ error: 'Bad Request', message: 'Invalid template_id: Template not found' }); // Возвращаем ошибку 400, если шаблон не найден
        }

        doc.end(); // Завершаем документ

        // Проверяем размер PDF
        let pdfBuffer = Buffer.concat([]); // Создаем буфер для PDF
        passThrough.on('data', chunk => {
            pdfBuffer = Buffer.concat([pdfBuffer, chunk]); // Собираем данные в буфер
        });

        passThrough.on('end', () => {
            if (pdfBuffer.length > 5 * 1024 * 1024) { // Проверяем, не превышает ли размер 5MB
                return res.status(413).json({ error: 'Payload Too Large', message: 'Generated PDF exceeds 5MB limit' });
            }
            res.send(pdfBuffer); // Отправляем PDF в ответ
        });

    } catch (error) {
        console.error('Error generating PDF:', error); // Логируем ошибку
        return res.status(500).json({ error: 'Internal Server Error', message: error.message }); // Возвращаем ошибку 500 в случае ошибки
    }
});

// Обработка ошибок для превышения размера входных данных
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Bad Request', message: 'Request body is too large' }); // Возвращаем ошибку 400, если тело запроса слишком большое
    }
    next(); // Передаем управление следующему middleware
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); // Выводим сообщение о запуске сервера
});