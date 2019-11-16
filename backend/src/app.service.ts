import { Injectable } from '@nestjs/common';
import * as childProcess from 'child_process';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
@Injectable()
export class AppService {
  pdf2json(buffer: Buffer) {
    const name = Math.random()
      .toString(26)
      .substr(2, 5);

    writeFileSync(`static/${name}.pdf`, buffer);

    childProcess.execSync(`pdf2json static/${name}.pdf static/${name}.json`);

    const jsonStr = readFileSync(`static/${name}.json`, {
      encoding: 'utf-8',
    }).toString();
    return JSON.parse(jsonStr);
  }
}
