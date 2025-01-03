const PDFDocument = require('pdfkit');

function generateTemplate2(doc, cv_data) {
    // Left section (contact info only) - beige panel shorter
    doc.fillColor('#F2E8E4').rect(0, 0, 200, 200).fill();

    // Right section - made wider
    doc.fillColor('#4A5D5A').rect(200, 0, 615, 100).fill();

    // Name and title
    doc.fillColor('#FFFFFF')
       .fontSize(32)
       .text(cv_data.personal.full_name, 280, 40);
    
    doc.fillColor('#FFFFFF')
       .fontSize(16)
       .text(cv_data.personal.title, 280, 80);

    // Contact Information (Left side)
    const contactX = 20;
    const contactY = 120;

    // Phone
    doc.fillColor('#333333')
       .fontSize(12)
       .text(cv_data.personal.phone, contactX, contactY);

    // Email
    doc.fillColor('#333333')
       .fontSize(12)
       .text(cv_data.personal.email, contactX, contactY + 25);

    // Address
    doc.fillColor('#333333')
       .fontSize(12)
       .text(cv_data.personal.location, contactX, contactY + 50, {
           width: 160
       });

    // Skills Section (Left side)
    let leftY = contactY + 100;
    doc.fillColor('#333333')
       .fontSize(20)
       .text('SKILLS', contactX, leftY);

    // Separator line under SKILLS
    doc.moveTo(contactX, leftY + 25)
       .lineTo(180, leftY + 25)
       .stroke('#333333');

    leftY += 40;
    cv_data.skills.forEach(skill => {
        doc.fillColor('#333333')
           .fontSize(12)
           .text('*  ' + skill, contactX, leftY);
        leftY += 20;
    });

    // Languages Section (Left side)
    leftY += 15;
    doc.fillColor('#333333')
       .fontSize(20)
       .text('LANGUAGES', contactX, leftY);

    // Separator line under LANGUAGES
    doc.moveTo(contactX, leftY + 25)
       .lineTo(180, leftY + 25)
       .stroke('#333333');

    leftY += 40;
    cv_data.languages.forEach(lang => {
        doc.fillColor('#333333')
           .fontSize(12)
           .text(`*  ${lang.name} - ${lang.level}`, contactX, leftY);
        leftY += 20;
    });

    // Right side content starts right after the green header
    let rightX = 240;
    let rightY = 120;
    const dateX = 500;
    const maxLineWidth = 30; // Maximum characters per line
    const lineHeight = 20; // Height between lines

    // Helper function to format text with line breaks
    function formatLongText(text, maxWidth) {
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

    // Helper function to render text with line breaks
    function renderFormattedText(text, x, y, fontSize) {
        const lines = formatLongText(text, maxLineWidth);
        doc.fontSize(fontSize);
        lines.forEach((line, index) => {
            doc.text(line, x, y + index * lineHeight);
        });
        return lines.length * lineHeight;
    }

    // Education Section
    doc.fillColor('#333333')
       .fontSize(20)
       .text('EDUCATION', rightX, rightY);

    // Separator line under EDUCATION
    doc.moveTo(rightX, rightY + 25)
       .lineTo(750, rightY + 25)
       .stroke('#333333');

    doc.moveDown();

    cv_data.education.forEach(edu => {
        doc.fillColor('#333333')
           .fontSize(16)
           .text(`${edu.degree} in ${edu.field}`);
        doc.fontSize(14)
           .text(`${edu.institution}`);
        doc.fontSize(14)
           .text(`Graduation: ${edu.graduation_year}`);
        doc.moveDown();
    });

    // Добавляем дополнительный отступ между Education и Experience
    rightY = doc.y + 30;

    // Experience Section
    doc.fillColor('#333333')
       .fontSize(20)
       .text('EXPERIENCE', rightX, rightY);

    // Separator line under EXPERIENCE
    doc.moveTo(rightX, rightY + 25)
       .lineTo(750, rightY + 25)
       .stroke('#333333');

    doc.moveDown();

    cv_data.experience.forEach(exp => {
      doc.fillColor('#000').fontSize(14).text(`${exp.position} at ${exp.company}`);
      doc.text(`Period: ${exp.start_date} - ${exp.end_date}`);
      doc.text(exp.description);
      doc.moveDown();
  });
}

module.exports = generateTemplate2; 