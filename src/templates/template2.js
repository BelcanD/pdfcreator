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

    rightY += 40;
    cv_data.education.forEach(edu => {
        // Degree and field
        const degreeText = `${edu.degree} in ${edu.field}`;
        const degreeHeight = renderFormattedText(degreeText, rightX, rightY, 16);

        // Year on the right
        doc.fillColor('#333333')
           .fontSize(14)
           .text(edu.graduation_year, dateX, rightY);

        // Institution with proper spacing
        const institutionY = rightY + degreeHeight + lineHeight;
        const institutionHeight = renderFormattedText(edu.institution, rightX, institutionY, 14);

        rightY = institutionY + institutionHeight + lineHeight;
    });

    // Experience Section
    rightY += 10;
    doc.fillColor('#333333')
       .fontSize(20)
       .text('EXPERIENCE', rightX, rightY);

    // Separator line under EXPERIENCE
    doc.moveTo(rightX, rightY + 25)
       .lineTo(750, rightY + 25)
       .stroke('#333333');

    rightY += 40;
    cv_data.experience.forEach(exp => {
        // Position title
        const positionHeight = renderFormattedText(exp.position, rightX, rightY, 16);

        // Date range on the right
        const dateText = exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.start_date;
        doc.fillColor('#333333')
           .fontSize(14)
           .text(dateText, dateX, rightY);

        // Company name with proper spacing
        const companyY = rightY + positionHeight + lineHeight;
        const companyHeight = renderFormattedText(exp.company, rightX, companyY, 14);

        // Description (with fixed spacing from the last line of company)
        if (exp.description) {
            const descriptionY = companyY + companyHeight + lineHeight;
            const descriptionHeight = renderFormattedText(exp.description, rightX, descriptionY, 12);
            rightY = descriptionY + descriptionHeight + 20;
        } else {
            rightY = companyY + companyHeight + 20;
        }
    });
}

module.exports = generateTemplate2; 