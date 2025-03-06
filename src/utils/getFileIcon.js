import WordImg from '../assets/wordimg.png';
import PdfImg from '../assets/pdfimg.png';
import TextImg from '../assets/textImg.png';
import ExcelImg from '../assets/excelimg.png';
import PptImg from '../assets/pptimg.png';

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  switch (extension) {
    case 'pdf':
      return PdfImg;
    case 'doc':
    case 'docx':
      return WordImg;
    case 'txt':
      return TextImg;
    case 'ppt':
    case 'pptx':
      return PptImg;
    case 'xls':
    case 'xlsx':
      return ExcelImg;
    default:
      return 'path/to/unknown-icon.png';
  }
};

export default getFileIcon;
