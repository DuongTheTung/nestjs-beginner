import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from '../subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

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
        
        await this.mailerService.sendMail({
          to: "haryphamdev@gmail.com", // should be subs.email, but hardcoded for test
          from: '"Support Team" <support@example.com>',
          subject: 'Welcome to Nice App! Here are some jobs for you',
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        });
      }
    }
  }
}
