import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from '../subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    @InjectQueue('mail-queue')
    private readonly mailQueue: Queue,

    private readonly mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) { }

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length > 0) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })

        await this.mailQueue.add(
          'send-sub-jobs',
          {
            email: subs.email,
            name: subs.name,
            jobs: jobs,
          },
          {
            attempts: 3, // Thử lại tối đa 3 lần nếu có lỗi
            backoff: 5000, // Đợi 5 giây trước khi thử lại
            removeOnComplete: true, // Xóa khỏi Redis khi gửi thành công
          }
        );
      }
    }
    this.logger.log(`Đã đẩy toàn bộ danh sách email cần gửi vào hàng đợi.`);
  }
}
