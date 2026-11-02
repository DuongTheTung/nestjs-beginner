import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage, SkipCheckPermission } from '../decorator/customize';
import { ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ResponseMessage('Upload Single File')
  @SkipCheckPermission()
  @UseInterceptors(FileInterceptor('fileUpload'))
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'folder_type',
    required: false,
    description: 'Thư mục lưu file: resume, company, default... (Mặc định: default)',
  })
  @ApiBody({
    description: 'Chọn file để upload (hỗ trợ: jpg, jpeg, png, gif, pdf, doc, docx < 5MB)',
    schema: {
      type: 'object',
      properties: {
        fileUpload: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file để upload (field: fileUpload)');
    }
    return {
      fileName: file.filename
    };
  }
}
