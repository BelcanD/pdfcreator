const PDFDocument = require('pdfkit');

function generateTemplate1(doc, cv_data) {
    // Constants for text formatting and spacing
    const maxLineWidth = 30; // Maximum characters per line
    const lineHeight = 20; // Height between lines
    const sectionSpacing = 30; // Space between sections
    const itemSpacing = 10; // Space between items in a section

    // Заголовок
    doc.fillColor('#070c17').rect(200, 30, 615, 100).fill();
    doc.moveDown(1);

    // Личная информация
    doc.fillColor('#fff');
    const name = cv_data.personal.full_name;
    const yPosition = 80;
    const xPosition = 280;

    doc.fontSize(30)
       .text(name, xPosition, yPosition);

    // Левый столбец
    doc.moveTo(0, 0)
        .lineTo(0, 720)
        .bezierCurveTo(50, 680, 100, 700, 200, 760)
        .lineTo(200, 760)
        .lineTo(200, 0)
        .closePath()
        .fill('#070c17');

    // Helper function to format text with line breaks
    function formatLongText(text, maxWidth) {
        if (!text) return [];
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if ((currentLine + ' ' + words[i]).length <= maxWidth) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Helper function to render text with line breaks and get height
    function renderFormattedText(text, x, y, fontSize, color = null) {
        if (color) doc.fillColor(color);
        const lines = formatLongText(text, maxLineWidth);
        doc.fontSize(fontSize);
        lines.forEach((line, index) => {
            doc.text(line, x, y + index * lineHeight);
        });
        return lines.length * lineHeight;
    }

    // Блок с контактной информацией
    const contactX = 40;
    const contactY = 150;

    // Заголовок блока "Contact"
    doc.fillColor('#fff')
       .fontSize(24)
       .text('Contact', contactX, contactY);

    // Контактная информация
    let currentY = contactY + 40;
    renderFormattedText(cv_data.personal.email, contactX, currentY, 12, '#fff');
    currentY += lineHeight + itemSpacing;
    renderFormattedText(cv_data.personal.phone, contactX, currentY, 12, '#fff');
    currentY += lineHeight + itemSpacing;
    renderFormattedText(cv_data.personal.location, contactX, currentY, 12, '#fff');
    currentY += lineHeight + sectionSpacing;

    // Блок с навыками
    doc.fillColor('#fff')
       .fontSize(24)
       .text('Skills', contactX, currentY);
    currentY += 40;

    // Навыки
    cv_data.skills.forEach(skill => {
        renderFormattedText(skill, contactX, currentY, 12, '#fff');
        currentY += lineHeight + itemSpacing;
    });
    currentY += sectionSpacing - itemSpacing;

    // Блок с языками
    doc.fillColor('#fff')
       .fontSize(24)
       .text('Languages', contactX, currentY);
    currentY += 40;

    // Языки
    cv_data.languages.forEach(lang => {
        renderFormattedText(`${lang.name} - ${lang.level}`, contactX, currentY, 12, '#fff');
        currentY += lineHeight + itemSpacing;
    });

    // Правая часть
    const rightX = 250;
    let rightY = 150;

    // Блок с образованием
    doc.fillColor('#070c17')
       .fontSize(24)
       .text('Education', rightX, rightY);
    doc.moveDown();

    cv_data.education.forEach(edu => {
        doc.fillColor('#000').fontSize(14)
           .text(`${edu.degree} in ${edu.field}`);
        doc.text(`${edu.institution}`);
        doc.text(`Graduation: ${edu.graduation_year}`);
        doc.moveDown();
    });

    // Добавляем дополнительный отступ между Education и Experience
    rightY = doc.y + 30;

    // Блок с опытом работы
    doc.fillColor('#070c17')
       .fontSize(24)
       .text('Experience', rightX, rightY);
    doc.moveDown();
    cv_data.experience.forEach(exp => {
        doc.fillColor('#000').fontSize(14).text(`${exp.position} at ${exp.company}`);
        doc.text(`Period: ${exp.start_date} - ${exp.end_date}`);
        doc.text(exp.description);
        doc.moveDown();
    });
}

module.exports = generateTemplate1;