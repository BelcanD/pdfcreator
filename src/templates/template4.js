const PDFDocument = require('pdfkit');

function generateTemplate4(doc, cv_data) {
    // Constants for layout
    const margin = 40;
    const pageWidth = 595.28;
    const rightX = margin;
    let rightY = margin;

    doc.fillColor('#333').fontSize(30).text('Professional Profile', { align: 'center' });
    doc.moveDown();
    doc.fillColor('#000').fontSize(18).text(`Name: ${cv_data.personal.full_name}`);
    doc.text(`Contact: ${cv_data.personal.email}, ${cv_data.personal.phone}`);
    doc.moveDown();

    doc.fillColor('#555').fontSize(20).text('Professional Summary');
    doc.fillColor('#000').fontSize(14).text(cv_data.profile);
    doc.moveDown();

    rightY = doc.y + 30;

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

    rightY = doc.y + 30;

    // Experience section
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

module.exports = generateTemplate4; 