const PDFDocument = require('pdfkit');

function generateTemplate1(doc, cv_data) {
    // Заголовок
    doc.fillColor('#070c17').rect(200, 30, 615, 100).fill(); // Фон заголовка
    doc.moveDown(1);

    // Личная информация
    doc.fillColor('#fff'); // Цвет текста
    const name = cv_data.personal.full_name;
    const yPosition = 80; // Вертикальная позиция (сдвинуто на 30 пикселей вниз)
    const xPosition = 280; // Фиксированная горизонтальная позиция (сдвинуто на 30 пикселей вправо)

    // Установка размера шрифта
    doc.fontSize(30); // Размер шрифта для имени
    doc.text(name, xPosition, yPosition); // Полное имя на фоне заголовка
    doc.moveDown(2); // Добавляем отступ после имени

    // Левый столбец
    doc.moveTo(0, 0)
        .lineTo(0, 720)
        .bezierCurveTo(50, 680, 100, 700, 200, 760) // Плавная кривая
        .lineTo(200, 760)
        .lineTo(200, 0)
        .closePath()
        .fill('#070c17'); // Заполнение цветом

    // Блок с контактной информацией
    const contactX = 40; // Позиция по оси X (сдвинуто на 30 пикселей)
    const contactY = 150; // Позиция по оси Y

    // Заголовок блока "Contact"
    doc.fillColor('#fff'); // Цвет текста
    doc.fontSize(24).text('Contact', contactX, contactY); // Заголовок (размер шрифта 24)
    doc.moveDown(1); // Добавляем отступ после заголовка

    // Промежуток между заголовком и контактной информацией
    const spacing = 20; // Промежуток
    const emailY = contactY + 40; // Позиция для Email

    // Контактная информация
    doc.fontSize(12); // Размер шрифта для контактной информации
    doc.text(`Email: ${cv_data.personal.email}`, contactX, emailY); // Email
    doc.moveDown(1); // Добавляем отступ после Email
    doc.text(`Phone: ${cv_data.personal.phone}`, contactX, emailY + spacing); // Телефон
    doc.moveDown(1); // Добавляем отступ после Телефона
    doc.text(`Location: ${cv_data.personal.location}`, contactX, emailY + spacing * 2); // Местоположение
    doc.moveDown(2); // Добавляем отступ перед блоком навыков

    // Блок с навыками
    const skillsX = 40; // Позиция по оси X для навыков (сдвинуто на 30 пикселей)
    const skillsY = emailY + 100; // Позиция по оси Y (отступ от контактов)

    // Заголовок блока "Skills"
    doc.fillColor('#fff'); // Цвет текста
    doc.fontSize(24).text('Skills', skillsX, skillsY); // Заголовок (размер шрифта 24)
    doc.moveDown(1); // Добавляем отступ после заголовка

    // Навыки
    doc.fontSize(12); // Размер шрифта для информации о навыках
    let lastSkillY; // Переменная для хранения позиции последнего элемента навыков
    cv_data.skills.forEach((skill, index) => {
        const skillY = skillsY + 40 + index * 20; // Позиция для каждого элемента навыков
        doc.text(skill, skillsX, skillY);
        lastSkillY = skillY; // Обновляем позицию последнего элемента
    });
    doc.moveDown(2); // Добавляем отступ перед блоком образования

    // Блок с образованием
    const educationX = 250; // Позиция по оси X для образования (сдвинуто на 30 пикселей)
    const educationY = 150; // Позиция по оси Y (на том же уровне, что и контакты)

    // Заголовок блока "Education"
    doc.fillColor('#070c17'); // Цвет текста
    doc.fontSize(24).text('Education', educationX, educationY); // Заголовок (размер шрифта 24)
    doc.moveDown(1); // Добавляем отступ после заголовка

    // Образование
    doc.fontSize(12); // Размер шрифта для информации об образовании
    cv_data.education.forEach((edu, index) => {
        const eduY = educationY + 40 + index * 20; // Позиция для каждого элемента образования
        doc.text(`${edu.degree} in ${edu.field}, ${edu.institution} (${edu.graduation_year})`, educationX, eduY);
    });
    doc.moveDown(2); // Добавляем отступ перед блоком опыта работы

    // Блок с опытом работы
    const experienceX = 250; // Позиция по оси X для опыта работы (сдвинуто на 30 пикселей)
    const experienceY = educationY + 100; // Позиция по оси Y (отступ от образования)

    // Заголовок блока "Experience"
    doc.fillColor('#070c17'); // Цвет текста
    doc.fontSize(24).text('Experience', experienceX, experienceY); // Заголовок (размер шрифта 24)
    doc.moveDown(1); // Добавляем отступ после заголовка

    // Опыт работы
    doc.fontSize(12); // Размер шрифта для информации об опыте работы
    cv_data.experience.forEach((exp, index) => {
        const expY = experienceY + 40 + index * 20; // Позиция для каждого элемента опыта работы
        doc.text(`${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date})`, experienceX, expY);
        doc.text(`${exp.description}`, experienceX, expY + 15); // Описание
        doc.moveDown(1); // Добавляем отступ после каждого опыта работы
    });
    doc.moveDown(2); // Добавляем отступ перед блоком языков

    // Блок с языками
    const languagesX = 40; // Позиция по оси X для языков (сдвинуто на 30 пикселей)
    const languagesY = lastSkillY + 40; // Позиция по оси Y (отступ от последнего элемента навыков)

    // Заголовок блока "Languages"
    doc.fillColor('#fff'); // Цвет текста
    doc.fontSize(24).text('Languages', languagesX, languagesY); // Заголовок (размер шрифта 24)
    doc.moveDown(1); // Добавляем отступ после заголовка

    // Языки
    doc.fontSize(12); // Размер шрифта для информации о языках
    cv_data.languages.forEach((lang, index) => {
        const langY = languagesY + 40 + index * 20; // Позиция для каждого элемента языков
        doc.text(`${lang.name} - ${lang.level}`, languagesX, langY);
    });
}

module.exports = generateTemplate1;