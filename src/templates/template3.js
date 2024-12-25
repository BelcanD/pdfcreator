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

    // Contact Information
    const contactY = margin + 60;
    const contactHeight = 25;
    const contactWidth = 250;
    const contactX = (pageWidth - contactWidth) / 2;

    // Phone tile (with beige background)
    doc.rect(contactX - 10, contactY - 5, contactWidth + 20, contactHeight)
       .fill(beigeColor);
    doc.fontSize(12)
       .fillColor('#333')
       .text(cv_data.personal.phone, contactX, contactY, { align: 'center' });

    // Location (without background)
    doc.fontSize(12)
       .fillColor('#333')
       .text(cv_data.personal.location, contactX, contactY + 25, { align: 'center' });

    // Email (without background)
    doc.fontSize(12)
       .fillColor('#333')
       .text(cv_data.personal.email, contactX, contactY + 50, { align: 'center' });

    const contentStartY = contactY + 100;
    const leftX = margin;
    const rightX = pageWidth / 2 + margin / 2;
    let leftY = contentStartY;
    let rightY = contentStartY;

    // Left Column
    // Skills Section with blue frame
    doc.rect(leftX - 10, leftY - 10, leftColumnWidth + 20, 120)
       .lineWidth(2)
       .stroke(mainBlue);

    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor(mainBlue)
       .text('SKILLS', leftX, leftY);

    leftY += 25;
    // Display skills as a list
    if (Array.isArray(cv_data.skills)) {
        cv_data.skills.forEach(skill => {
            doc.font('Helvetica')
               .fontSize(12)
               .fillColor('#333')
               .text(`• ${skill}`, leftX + 5, leftY);
            leftY += 20;
        });
    }

    // Education Section
    leftY = contentStartY + 140;
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor(mainBlue)
       .text('EDUCATION', leftX, leftY);

    leftY += 25;
    cv_data.education.forEach(edu => {
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .fillColor('#333')
           .text(`${edu.degree}`, leftX, leftY);
        
        if (edu.field) {
            doc.font('Helvetica')
               .fontSize(12)
               .text(`in ${edu.field}`, leftX, leftY + 15);
            leftY += 15;
        }
        
        doc.font('Helvetica')
           .fontSize(12)
           .text(edu.institution, leftX, leftY + 15)
           .text(`Graduation: ${edu.graduation_year}`, leftX, leftY + 30);
        
        if (edu.description) {
            doc.text(edu.description, leftX, leftY + 45, {
                width: leftColumnWidth
            });
            leftY += 60;
        } else {
            leftY += 45;
        }
        
        leftY += 20;
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
    const timelineX = rightX + 10;
    const contentX = rightX + 30;
    const contentWidth = pageWidth - contentX - margin;

    cv_data.experience.forEach((exp, index) => {
        // Timeline dot
        doc.circle(timelineX, rightY + 10, 5)
           .fillAndStroke(mainBlue);

        // Vertical line
        doc.moveTo(timelineX, rightY + 15)
           .lineTo(timelineX, rightY + 80)
           .stroke(mainBlue);

        // Experience details
        doc.font('Helvetica-Bold')
           .fontSize(14)
           .fillColor(mainBlue)
           .text(exp.company.toUpperCase(), contentX, rightY);

        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333')
           .text(`Role: ${exp.position}`, contentX, rightY + 20)
           .text(`Period: ${exp.start_date} to ${exp.end_date}`, contentX, rightY + 35);

        if (exp.description) {
            doc.text(exp.description, contentX, rightY + 50, {
                width: contentWidth,
                align: 'left'
            });
        }

        rightY += 100;
    });
}

module.exports = generateTemplate3;