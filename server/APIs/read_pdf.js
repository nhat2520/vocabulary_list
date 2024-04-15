const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mathjax = require('mathjax-node');

/**
 * Class to read a PDF file and process mathematical formulas.
 */
export class PdfReader {
  /**
   * @param {string} pdfPath - The path to the PDF file.
   */
  constructor(pdfPath) {
    this.pdfPath = path.normalize(pdfPath);
  }

  /**
   * Processes a mathematical formula using MathJax.
   * @param {string} formula - The mathematical formula in TeX format.
   * @returns {Promise<string>} - Returns a promise that resolves with the SVG representation of the formula.
   */
  async processMath(formula) {
    return new Promise((resolve, reject) => {
      mathjax.typeset({
        math: formula,
        format: 'TeX',
        svg: true,
      }, (data) => {
        if (!data.errors) {
          resolve(data.svg);
        } else {
          reject(data.errors);
        }
      });
    });
  }

  /**
   * Reads the PDF file, processes mathematical formulas, and logs the text.
   */
  async read() {
    let dataBuffer = fs.readFileSync(this.pdfPath);

    pdfParse(dataBuffer).then(async function(data) {
      let text = data.text;

      // Regular expression to match LaTeX formulas
      const regex = /\$(.*?)\$/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        try {
          let formula = match[1];
          let svg = await this.processMath(formula);
          text = text.replace(`$${formula}$`, svg);
        } catch (error) {
          console.error('An error occurred while processing the mathematical formula:', error);
        }
      }

      console.log(text);
    }).catch(error => {
      console.error('An error occurred while reading the PDF:', error);
    });
  }
}

// Using the class
const pdfPath = "C:\\Users\\nguye\\Downloads\\Con đường chẳng mấy ai đi.pdf"; // Your PDF file path
const reader = new PdfReader(pdfPath);
reader.read();
