const PDFDocument = require('pdfkit');

function generateTemplate2(doc, cv_data) {
    // Left section (contact info only) - beige panel ends after address
    doc.fillColor('#F2E8E4').rect(0, 0, 200, 250).fill();

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
       .text(cv_data.personal.email, contactX, contactY + 30);

    // Address
    doc.fillColor('#333333')
       .fontSize(12)
       .text(cv_data.personal.location, contactX, contactY + 60, {
           width: 160
       });

    // Right side content starts right after the green header
    let rightX = 280;
    let rightY = 120;

    // Skills Section
    doc.fillColor('#333333')
       .fontSize(20)
       .text('SKILLS', rightX, rightY);

    // Separator line under SKILLS
    doc.moveTo(rightX, rightY + 30)
       .lineTo(780, rightY + 30)
       .stroke('#333333');

    rightY += 50;
    cv_data.skills.forEach(skill => {
        doc.fillColor('#333333')
           .fontSize(12)
           .text('*  ' + skill, rightX, rightY);
        rightY += 25;
    });

    // Languages Section
    rightY += 20;
    doc.fillColor('#333333')
       .fontSize(20)
       .text('LANGUAGES', rightX, rightY);

    // Separator line under LANGUAGES
    doc.moveTo(rightX, rightY + 30)
       .lineTo(780, rightY + 30)
       .stroke('#333333');

    rightY += 50;
    cv_data.languages.forEach(lang => {
        doc.fillColor('#333333')
           .fontSize(12)
           .text(`*  ${lang.name} - ${lang.level}`, rightX, rightY);
        rightY += 25;
    });

    // Education Section
    rightY += 20;
    doc.fillColor('#333333')
       .fontSize(20)
       .text('EDUCATION', rightX, rightY);

    // Separator line under EDUCATION
    doc.moveTo(rightX, rightY + 30)
       .lineTo(780, rightY + 30)
       .stroke('#333333');

    rightY += 50;
    cv_data.education.forEach(edu => {
        doc.fillColor('#333333')
           .fontSize(16)
           .text(`${edu.degree} in ${edu.field}`, rightX, rightY);
        
        doc.fillColor('#4A5D5A')
           .fontSize(14)
           .text(edu.graduation_year, rightX + 420, rightY, {
               align: 'right'
           });

        doc.fillColor('#333333')
           .fontSize(14)
           .text(edu.institution, rightX, rightY + 25);

        rightY += 70;
    });

    // Experience Section
    doc.fillColor('#333333')
       .fontSize(20)
       .text('EXPERIENCE', rightX, rightY);

    // Separator line under EXPERIENCE
    doc.moveTo(rightX, rightY + 30)
       .lineTo(780, rightY + 30)
       .stroke('#333333');

    rightY += 50;
    cv_data.experience.forEach(exp => {
        doc.fillColor('#333333')
           .fontSize(16)
           .text(`${exp.position}`, rightX, rightY);

        doc.fillColor('#4A5D5A')
           .fontSize(14)
           .text(exp.start_date, rightX + 420, rightY, {
               align: 'right'
           });

        doc.fillColor('#333333')
           .fontSize(14)
           .text(exp.company, rightX, rightY + 25);

        doc.fontSize(12)
           .text(exp.description, rightX, rightY + 50, {
               width: 500
           });

        rightY += 100;
    });
}

module.exports = generateTemplate2; 