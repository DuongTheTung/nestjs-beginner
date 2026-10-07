import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from '../decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ResponseMessage('Upload Single File')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    };
  }
}
