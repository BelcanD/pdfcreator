const PDFDocument = require('pdfkit');

function generateTemplate3(doc, cv_data) {
    // Constants
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const leftColumnWidth = 200;
    const beigeColor = '#F5F5DC';
    const mainBlue = '#1B365C';

    // Name at the top
    doc.font('Helvetica-Bold')
       .fontSize(32)
       .fillColor(mainBlue)
       .text(cv_data.personal.full_name.toUpperCase(), margin, margin, { align: 'center' });

    // Contact Information with beige tiles
    const contactY = margin + 60;
    const contactHeight = 25;
    const contactWidth = 200;
    const contactX = (pageWidth - contactWidth) / 2;

    // Phone tile
    doc.rect(contactX - 10, contactY - 5, contactWidth + 20, contactHeight)
       .fill(beigeColor);
    doc.fontSize(12)
       .fillColor('#333')
       .text(cv_data.personal.phone, contactX, contactY, { align: 'center' });

    // Location tile
    doc.rect(contactX - 10, contactY + 25 - 5, contactWidth + 20, contactHeight)
       .fill(beigeColor);
    doc.text(cv_data.personal.location, contactX, contactY + 25, { align: 'center' });

    // Email tile
    doc.rect(contactX - 10, contactY + 50 - 5, contactWidth + 20, contactHeight)
       .fill(beigeColor);
    doc.text(cv_data.personal.email, contactX, contactY + 50, { align: 'center' });

    const contentStartY = contactY + 100;
    const leftX = margin;
    const rightX = pageWidth / 2 + margin;
    let leftY = contentStartY;
    let rightY = contentStartY;

    // Left Column
    // Skills Section with blue frame
    doc.rect(leftX - 10, leftY - 10, leftColumnWidth + 20, 100)
       .lineWidth(2)
       .stroke(mainBlue);

    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor(mainBlue)
       .text('SKILLS', leftX, leftY);

    doc.font('Helvetica')
       .fontSize(12)
       .fillColor('#333')
       .text(cv_data.skills || 'Technical skills include: JavaScript, Node.js, React, Python', 
             leftX, leftY + 25, {
                 width: leftColumnWidth,
                 align: 'left'
             });

    // Education Section
    leftY += 120;
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor(mainBlue)
       .text('EDUCATION', leftX, leftY);

    leftY += 25;
    cv_data.education.forEach(edu => {
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .fillColor('#333')
           .text(`${edu.degree} in ${edu.field}`, leftX, leftY);
        
        doc.font('Helvetica')
           .fontSize(12)
           .text(edu.institution, leftX, leftY + 20)
           .text(`Graduation: ${edu.graduation_year}`, leftX, leftY + 40);
        
        if (edu.description) {
            doc.text(edu.description, leftX, leftY + 60, {
                width: leftColumnWidth
            });
        }
        
        leftY += 100;
    });

    // Languages Section
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor(mainBlue)
       .text('LANGUAGES', leftX, leftY);

    leftY += 25;
    cv_data.languages.forEach(lang => {
        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333')
           .text(`${lang.name} - ${lang.level}`, leftX, leftY);
        leftY += 20;
    });

    // Right Column - Experiences Section with Timeline
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor(mainBlue)
       .text('EXPERIENCES', rightX, rightY);

    rightY += 40;
    cv_data.experience.forEach((exp, index) => {
        // Timeline dot
        doc.circle(rightX + 10, rightY + 10, 5)
           .fillAndStroke(mainBlue);

        // Vertical line for all items
        doc.moveTo(rightX + 10, rightY + 15)
           .lineTo(rightX + 10, rightY + 80)
           .stroke(mainBlue);

        // Experience details
        doc.font('Helvetica-Bold')
           .fontSize(14)
           .fillColor(mainBlue)
           .text(exp.company.toUpperCase(), rightX + 30, rightY);

        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333')
           .text(`Role: ${exp.position}`, rightX + 30, rightY + 20)
           .text(`Period: ${exp.start_date} to ${exp.end_date}`, rightX + 30, rightY + 40);

        if (exp.description) {
            doc.text(exp.description, rightX + 30, rightY + 60, {
                width: pageWidth - rightX - margin * 3
            });
        }

        rightY += 100;
    });
}

module.exports = generateTemplate3;