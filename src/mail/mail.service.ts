import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from '../subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { CronExpressionParser } from 'cron-parser';

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

  // Gõ nhịp định kỳ mỗi giờ (hoặc '*/15 * * * *' mỗi 15 phút) để kiểm tra các subscriber đến hạn
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const now = new Date();

    // 1. Chỉ tìm những subscriber đã đến hạn (nextRunAt <= now) và đang kích hoạt
    const subscribers = await this.subscriberModel.find({
      nextRunAt: { $lte: now },
      isActive: { $ne: false },
      isDeleted: { $ne: true },
    });

    if (!subscribers || subscribers.length === 0) {
      return;
    }

    this.logger.log(`Tìm thấy ${subscribers.length} subscriber(s) đến hạn nhận email.`);

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
        });

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

      // 2. Tính toán mốc thời gian lần gửi tiếp theo dựa trên cron riêng của subscriber
      let nextRun = now;
      try {
        const interval = CronExpressionParser.parse(subs.cronExpression || '0 8 * * 1', {
          currentDate: now,
        });
        nextRun = interval.next().toDate();
      } catch {
        // Fallback cộng 7 ngày nếu biểu thức cron lỗi
        nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      // 3. Cập nhật nextRunAt và lastSentAt vào DB
      await this.subscriberModel.updateOne(
        { _id: subs._id },
        {
          nextRunAt: nextRun,
          lastSentAt: now,
        }
      );
    }

    this.logger.log(`Đã đẩy email vào hàng đợi và cập nhật nextRunAt cho ${subscribers.length} subscriber(s).`);
  }
}
