import { Injectable } from '@nestjs/common';
import * as pdf2json from 'pdf2json';

@Injectable()
export class AppService {
  pdf2json(buffer: Buffer) {
    return new Promise((resolve, reject) => {
      const pdfParser = new pdf2json();

      pdfParser.on('pdfParser_dataError', reject);

      pdfParser.on('pdfParser_dataReady', resolve);

      pdfParser.parseBuffer(buffer);
    });
  }
}
