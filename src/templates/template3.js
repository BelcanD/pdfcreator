const PDFDocument = require('pdfkit');

function generateTemplate3(doc, cv_data) {
    // Constants
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const imageSize = 200;

    // Add profile image
    if (cv_data.personal.image) {
        doc.image(cv_data.personal.image, margin, margin, {
            width: imageSize,
            height: imageSize
        });
    }

    // Name and Title
    doc.font('Helvetica-Bold')
       .fontSize(32)
       .fillColor('#1B365C')
       .text(cv_data.personal.full_name.toUpperCase(), imageSize + margin * 2, margin);

    doc.font('Helvetica')
       .fontSize(18)
       .fillColor('#1B365C')
       .text(cv_data.personal.title, imageSize + margin * 2, margin + 40);

    // Contact Information with icons
    const contactY = margin + 80;
    doc.fontSize(12)
       .fillColor('#333');
    
    // Phone
    doc.text(cv_data.personal.phone, imageSize + margin * 2, contactY);
    
    // Address
    doc.text(cv_data.personal.location, imageSize + margin * 2, contactY + 25);
    
    // Email
    doc.text(cv_data.personal.email, imageSize + margin * 2, contactY + 50);
    
    // Website/Portfolio
    if (cv_data.personal.website) {
        doc.text(cv_data.personal.website, imageSize + margin * 2, contactY + 75);
    }

    // Profile Section
    const profileY = margin + imageSize + 20;
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor('#1B365C')
       .text('PROFILE', margin, profileY);

    doc.font('Helvetica')
       .fontSize(12)
       .fillColor('#333')
       .text(cv_data.profile || 'Extensive experience in gourmet restaurants and the ability to lead large teams. Ease of developing good interpersonal relationships and ensuring customer satisfaction.', 
             margin, profileY + 25, {
                 width: imageSize - 20,
                 align: 'left'
             });

    // Education Section
    const eduY = profileY + 120;
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor('#1B365C')
       .text('EDUCATION', margin, eduY);

    let currentY = eduY + 25;
    cv_data.education.forEach(edu => {
        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333')
           .text(`${edu.graduation_year} - ${edu.degree}`, margin, currentY);
        currentY += 20;
    });

    // Languages Section
    const langY = currentY + 30;
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor('#1B365C')
       .text('LANGUAGES', margin, langY);

    currentY = langY + 25;
    cv_data.languages.forEach(lang => {
        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333')
           .text(`${lang.name} - ${lang.level}`, margin, currentY);
        currentY += 20;
    });

    // Experiences Section with Timeline
    const expX = imageSize + margin * 2;
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor('#1B365C')
       .text('EXPERIENCES', expX, profileY);

    let expY = profileY + 40;
    cv_data.experience.forEach((exp, index) => {
        // Timeline dot
        doc.circle(expX + 10, expY + 10, 5)
           .fillAndStroke('#1B365C');

        // Vertical line to next item if not last item
        if (index < cv_data.experience.length - 1) {
            doc.moveTo(expX + 10, expY + 15)
               .lineTo(expX + 10, expY + 80)
               .stroke('#1B365C');
        }

        // Experience details
        doc.font('Helvetica-Bold')
           .fontSize(14)
           .fillColor('#1B365C')
           .text(exp.company.toUpperCase(), expX + 30, expY);

        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333')
           .text(`Role: ${exp.position}`, expX + 30, expY + 20)
           .text(`Period: ${exp.start_date} to ${exp.end_date}`, expX + 30, expY + 40);

        if (exp.description) {
            doc.text(exp.description, expX + 30, expY + 60, {
                width: pageWidth - expX - margin * 3
            });
        }

        expY += 100; // Space for next experience item
    });
}

module.exports = generateTemplate3;