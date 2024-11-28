const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (discente, course) => {
    console.log('discente: ', discente);
    console.log('course: ', course);
  const folderPath = path.join(__dirname, '../uploads/certificates');
  console.log('folderPath: ', folderPath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const fileName = `${discente._id}-${course._id}.pdf`;
  console.log('fileName: ', fileName);
  const filePath = path.join(folderPath, fileName);
  console.log('filePath: ', filePath);

  const doc = new PDFDocument();

  // Set certificate background image
  const backgroundPath = path.join(__dirname, '../assets/certificate.jpg'); // Update path to your background image
  doc.image(backgroundPath, 0, 0, { width: 595.28, height: 841.89 }); // A4 size

  // Add text
  doc.fontSize(24).text('Certificate of Completion', { align: 'center', y: 200 });
  doc.fontSize(16).text(`This certifies that`, { align: 'center', y: 250 });
  doc.fontSize(20).text(`${discente.nome}`, { align: 'center', y: 300 });
  doc.fontSize(16).text(`has successfully completed the course`, { align: 'center', y: 350 });
  doc.fontSize(20).text(`${course.tipologia?.type}`, { align: 'center', y: 400 });

  // Save to file
  doc.end();
  doc.pipe(fs.createWriteStream(filePath));

  return filePath;
};


module.exports = generateCertificate;