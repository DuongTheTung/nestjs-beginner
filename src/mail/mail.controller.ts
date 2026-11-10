import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from '../decorator/customize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Kích hoạt quét subscribers và gửi email qua hàng đợi' })
  @ResponseMessage('Test email')
  async handleTestEmail() {
    await this.mailService.handleCron();
    return 'Đã kích hoạt gửi email vào hàng đợi thành công!';
  }
}
