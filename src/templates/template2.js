const PDFDocument = require('pdfkit');

function generateTemplate4(doc, cv_data) {
    // Background color for the right section
    doc.fillColor('#4A5D5A').rect(400, 0, 415, 200).fill();

    // Left section (contact info and photo area)
    doc.fillColor('#F2E8E4').rect(0, 0, 400, 842).fill();

    // Name and title
    doc.fillColor('#FFFFFF')
       .fontSize(32)
       .text(cv_data.personal.full_name, 420, 40);
    
    doc.fillColor('#FFFFFF')
       .fontSize(16)
       .text(cv_data.personal.title, 420, 80);

    // Description
    doc.fillColor('#FFFFFF')
       .fontSize(12)
       .text(cv_data.personal.description, 420, 120, {
           width: 380,
           align: 'left'
       });

    // Contact Information (Left side)
    const contactX = 40;
    const contactY = 220;

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
           width: 300
       });

    // Skills Section
    doc.fillColor('#333333')
       .fontSize(20)
       .text('SKILLS', contactX, contactY + 120);

    let currentY = contactY + 160;
    cv_data.skills.forEach(skill => {
        doc.fillColor('#333333')
           .fontSize(12)
           .text('*  ' + skill, contactX, currentY);
        currentY += 25;
    });

    // Languages Section
    doc.fillColor('#333333')
       .fontSize(20)
       .text('LANGUAGES', contactX, currentY + 20);

    currentY += 60;
    cv_data.languages.forEach(lang => {
        doc.fillColor('#333333')
           .fontSize(12)
           .text(`*  ${lang.name} - ${lang.level}`, contactX, currentY);
        currentY += 25;
    });

    // Education Section (Right side)
    let rightX = 420;
    let rightY = 220;

    doc.fillColor('#333333')
       .fontSize(20)
       .text('EDUCATION', rightX, rightY);

    rightY += 40;
    cv_data.education.forEach(edu => {
        doc.fillColor('#333333')
           .fontSize(16)
           .text(`${edu.degree} in ${edu.field}`, rightX, rightY);
        
        doc.fillColor('#4A5D5A')
           .fontSize(14)
           .text(edu.graduation_year, rightX + 320, rightY, {
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

    rightY += 40;
    cv_data.experience.forEach(exp => {
        doc.fillColor('#333333')
           .fontSize(16)
           .text(`${exp.position}`, rightX, rightY);

        doc.fillColor('#4A5D5A')
           .fontSize(14)
           .text(exp.start_date, rightX + 320, rightY, {
               align: 'right'
           });

        doc.fillColor('#333333')
           .fontSize(14)
           .text(exp.company, rightX, rightY + 25);

        doc.fontSize(12)
           .text(exp.description, rightX, rightY + 50, {
               width: 380
           });

        rightY += 100;
    });
}

module.exports = generateTemplate4; 