const PDFDocument = require('pdfkit');

function generateTemplate3(doc, cv_data) {
    doc.fillColor('#333').fontSize(30).text('Professional Profile', { align: 'center' });
    doc.moveDown();
    doc.fillColor('#000').fontSize(18).text(`Name: ${cv_data.personal.full_name}`);
    doc.text(`Contact: ${cv_data.personal.email}, ${cv_data.personal.phone}`);
    doc.moveDown();

    doc.fillColor('#555').fontSize(20).text('Professional Summary');
    doc.fillColor('#000').fontSize(14).text(cv_data.profile);
    doc.moveDown();

    doc.fillColor('#555').fontSize(20).text('Work Experience');
    cv_data.experience.forEach(exp => {
        doc.fillColor('#000').fontSize(14).text(`${exp.position} at ${exp.company}`);
        doc.text(`Period: ${exp.start_date} - ${exp.end_date}`);
        doc.moveDown();
    });
}

module.exports = generateTemplate3;