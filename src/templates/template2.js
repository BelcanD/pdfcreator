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
    const dateX = 400; // Moved dates closer
    const titleWidth = 150; // Width for titles
    const dateMargin = 10; // Margin between title and date

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
        const degreeText = `${edu.degree} in ${edu.field}`;
        
        // Degree title and year on the same line
        doc.fillColor('#333333')
           .fontSize(16)
           .text(degreeText, rightX, rightY, {
               width: titleWidth // Fixed width for title
           });
        
        doc.fillColor('#333333')
           .fontSize(14)
           .text(edu.graduation_year, rightX + titleWidth + dateMargin, rightY);

        // Institution on next line
        doc.fillColor('#333333')
           .fontSize(14)
           .text(edu.institution, rightX, rightY + 20);

        rightY += 45;
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
        // Position title and date on the same line
        doc.fillColor('#333333')
           .fontSize(16)
           .text(exp.position, rightX, rightY, {
               width: titleWidth // Fixed width for title
           });

        doc.fillColor('#333333')
           .fontSize(14)
           .text(exp.start_date, rightX + titleWidth + dateMargin, rightY);

        // Company name
        doc.fillColor('#333333')
           .fontSize(14)
           .text(exp.company, rightX, rightY + 20);

        // Description
        if (exp.description) {
            doc.fontSize(12)
               .text(exp.description, rightX, rightY + 40, {
                   width: 460,
                   align: 'left'
               });
            rightY += 70;
        } else {
            rightY += 45;
        }
    });
}

module.exports = generateTemplate2; 