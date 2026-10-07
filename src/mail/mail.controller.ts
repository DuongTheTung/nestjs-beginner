import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from '../decorator/customize';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @Public()
  @ResponseMessage('Test email')
  async handleTestEmail() {
    await this.mailService.handleCron();
  }
}
