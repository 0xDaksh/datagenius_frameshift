import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('pdf2json')
  @UseInterceptors(FileInterceptor('file'))
  async pdf2json(@UploadedFile() file) {
    const { buffer } = file;
    const outJSON = await this.appService.pdf2json(buffer);

    return outJSON;
  }

  @Post('pdf2text')
  @UseInterceptors(FileInterceptor('file'))
  async pdf2text(@UploadedFile() file) {
    const { buffer } = file;
    const { formImage } = (await this.appService.pdf2json(buffer)) as any;
    const texts = [];

    for (const page of formImage.Pages) {
      for (const text of page.Texts) {
        let currentText = '';
        text.R.forEach(curr => (currentText += ' ' + curr.T));
        texts.push(currentText);
      }
    }

    return decodeURIComponent(texts.join(''));
  }
}
