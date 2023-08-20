const fsP = require('fs/promises');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pdf = require('pdf-parse');

const jsonData = fs.readFileSync('annocementList.json', 'utf8');
const pdfDataList = JSON.parse(jsonData);


pdfDataList.forEach(async (pdfData, index) => {
  try {
    const pdfResponse = await axios.get(pdfData.url, { responseType: 'arraybuffer' });
    const pdfBuffer = pdfResponse.data;

    const pdfTextData = await pdf(pdfBuffer);
    const pdfText = pdfTextData.text;

    const arabicNumber = {
      '๐': '0',
      '๑': '1',
      '๒': '2',
      '๓': '3',
      '๔': '4',
      '๕': '5',
      '๖': '6',
      '๗': '7',
      '๘': '8',
      '๙': '9',
  };

    const title = pdfData.title;


    const titleArabic = title.replace(/[๐-๙]/g, match => arabicNumber[match]);
    const pdfTextArabic = pdfText.replace(/[๐-๙]/g, match => arabicNumber[match]);


    const replacements = {
      '“': '"', // Replace opening double quotes
      '‘': '"', // Replace opening single quotes
      '”': '"', // Replace closing double quotes
      '’': '"', // Replace closing single quotes
    };

    const pattern = new RegExp(Object.keys(replacements).join('|'), 'g');

    const pdfTextTrim = pdfTextArabic.replace(pattern, match => replacements[match]).replace(/หนา\s+\d+/g, ' ').replace(/เลม\s+\d+\s+ตอนที่\s+\d+\s+กราชกิจจานุเบกษา\d+\s+[\u0E00-\u0E7F]+\s+\d+/g, ' ').replace(/เลม\s+\d+\s+ตอนที่\s+\d+\s+งราชกิจจานุเบกษา\d+\s+[\u0E00-\u0E7F]+\s+\d+/g, ' ').replace(/เลม\s+\d+\s+ตอนที่\s+\d+\s+ขราชกิจจานุเบกษา\d+\s+[\u0E00-\u0E7F]+\s+\d+/g, ' ').replace(/เลม\s+\d+\s+ตอนที่\s+\d+\s+คราชกิจจานุเบกษา\d+\s+[\u0E00-\u0E7F]+\s+\d+/g, ' ');

    const markdownContent = [
      `\n# ${titleArabic}
      
      \n
      
      ${pdfTextTrim}`,
    ].join("\n\n")

    const pdfName = pdfData.url.split('/').pop().replace('.pdf', '');

    const pdfDateThai = pdfData.date.split(' ').join('');

    

    const pdfDate = pdfDateThai.replace(/[๐-๙]/g, match => arabicNumber[match]);

    
    if (!fs.existsSync(`ratchakitcha/${pdfDate}`)) {
      fs.mkdirSync(`ratchakitcha/${pdfDate}`);
    }

    const markdownFilePath = `ratchakitcha/${pdfDate}/${pdfName}.md`;
    fs.writeFileSync(markdownFilePath, markdownContent);


    console.log(`Converted PDF ${index + 1} to Markdown: ${markdownFilePath}`);
  } catch (error) {
    console.error(`Error processing PDF ${index + 1}:`, error.message);
  }
});
