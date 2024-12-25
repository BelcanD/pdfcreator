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
    const dateX = 500; // Moved dates more to the left
    const titleWidth = 240; // Width for titles before date
    const standardGap = 25; // Standard gap between elements

    // Helper function to calculate text height
    function calculateTextHeight(text, width, fontSize) {
        const avgCharPerLine = width / (fontSize * 0.5);
        const lines = Math.ceil(text.length / avgCharPerLine);
        return lines * (fontSize + 2); // fontSize + 2 for line spacing
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
        const degreeText = `${edu.degree} in ${edu.field}`;
        
        // Calculate degree text height
        const degreeHeight = calculateTextHeight(degreeText, titleWidth, 16);
        
        // Degree title
        doc.fillColor('#333333')
           .fontSize(16)
           .text(degreeText, rightX, rightY, {
               width: titleWidth,
               align: 'left'
           });

        // Year on the right
        doc.fillColor('#333333')
           .fontSize(14)
           .text(edu.graduation_year, dateX, rightY);

        // Institution on next line (after degree text)
        doc.fillColor('#333333')
           .fontSize(14)
           .text(edu.institution, rightX, rightY + degreeHeight + 10, {
               width: 280,
               align: 'left'
           });

        rightY += degreeHeight + standardGap + 20; // Total height + standard gap + institution height
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
        const positionHeight = calculateTextHeight(exp.position, titleWidth, 16);
        
        // Position title
        doc.fillColor('#333333')
           .fontSize(16)
           .text(exp.position, rightX, rightY, {
               width: titleWidth,
               align: 'left'
           });

        // Date range on the right
        const dateText = exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.start_date;
        doc.fillColor('#333333')
           .fontSize(14)
           .text(dateText, dateX, rightY);

        // Company name (after position text)
        doc.fillColor('#333333')
           .fontSize(14)
           .text(exp.company, rightX, rightY + positionHeight + 10, {
               width: 280,
               align: 'left'
           });

        // Description (after company name)
        if (exp.description) {
            doc.fontSize(12)
               .text(exp.description, rightX, rightY + positionHeight + standardGap + 20, {
                   width: 460,
                   align: 'left',
                   lineGap: 2
               });
            rightY += positionHeight + standardGap + 70; // Total height + gaps + description
        } else {
            rightY += positionHeight + standardGap + 30; // Total height + gap + company only
        }
    });
}

module.exports = generateTemplate2; 