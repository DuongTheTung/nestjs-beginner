import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('mail-queue')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) { }

  @Process('send-sub-jobs')
  async handleSendSubJobs(job: Job<{ email: string; name: string; jobs: any[] }>) {
    const { email, name, jobs } = job.data;

    // Gửi email thật qua mailerService
    await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Here are some jobs for you',
      template: 'new-job',
      context: {
        receiver: name,
        jobs: jobs,
      },
    });

    this.logger.log(`[Success] Đã gửi mail thành công tới: ${email}`);
  }

  // Bắt sự kiện khi một email bị lỗi thật (sau khi đã thử lại hết số lần cho phép)
  @OnQueueFailed()
  onError(job: Job, error: any) {
    this.logger.error(
      `[Failed] Gửi mail tới ${job.data.email} thất bại sau ${job.attemptsMade} lần thử: ${error.message}`
    );
  }
}
