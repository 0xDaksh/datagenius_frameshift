import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { TemplateEntity } from './template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: Repository<TemplateEntity>,
  ) {}

  @Post('/template')
  @UsePipes(new ValidationPipe())
  async createTemplate(@Body() data: Omit<TemplateEntity, 'id'>) {
    const template = this.templateRepository.create(data);
    await template.save();
    return template;
  }

  @Get('/templates')
  @UsePipes(new ValidationPipe())
  async getTemplates(@Body() data: Partial<TemplateEntity>) {
    return this.templateRepository.find({
      where: data,
    });
  }

  @Get('/templates/:id')
  async getTemplateFromId(@Param('id') id) {
    return this.templateRepository.findOne(id);
  }

  @Post('/extract/:id')
  @UseInterceptors(FileInterceptor('file'))
  async pdf2json(@Param('id') id, @UploadedFile() file) {
    const Template = await this.templateRepository.findOne(id);
    if (!Template) {
      return new HttpException('Invalid Id Provided', 400);
    }

    const columns = JSON.parse(Template.jsonColumns);
    const { buffer } = file;
    const outJSON = await this.appService.pdf2json(buffer);

    let pages = [];
    outJSON.forEach(page => {
      let template = {};
      for (let column of columns) {
        const { field, ...values } = column;
        template[field] = { ...values, pageNo: 1, elements: [] };
      }
      page['text'].forEach(text => {
        for (let key of Object.keys(template)) {
          let candidate = template[key];
          // if (candidate.pageNo == page.number) {
          if (
            candidate.x1 <= text.left &&
            text.left + text.width <= candidate.x2 &&
            candidate.y1 <= text.top + text.height &&
            text.top + text.height <= candidate.y2
          ) {
            if (text.data.trim().length !== 0) {
              template[key].elements.push(text);
            }
          }
          // }
        }
      });
      pages.push(template);
    });

    let results = [];
    for (let template of pages) {
      let result = {};
      for (let key of Object.keys(template)) {
        let out = '';
        template[key].elements.forEach(text => (out += ' ' + text.data));
        result[key] = out.trim();
      }
      results.push(result);
    }

    return results;
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
        texts.push(decodeURIComponent(currentText));
      }
    }

    return texts.join('');
  }
}
