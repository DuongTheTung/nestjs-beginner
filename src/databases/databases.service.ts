import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from '../permissions/schemas/permission.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import { Resume, ResumeDocument } from '../resumes/schemas/resume.schema';
import { Subscriber, SubscriberDocument } from '../subscribers/schemas/subscriber.schema';
import { UsersService } from '../users/users.service';
import { INIT_PERMISSIONS, INIT_ROLES, INIT_USERS, INIT_COMPANIES, INIT_JOBS, INIT_RESUMES, INIT_SUBSCRIBERS } from './sample.data';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>,
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
    @InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>,
    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit) === true) {
      const countUser = await this.userModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});

      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }
      
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        const roleAdmin = INIT_ROLES.find((item) => item.name === 'ADMIN');
        if (roleAdmin) {
            await this.roleModel.create({
                name: roleAdmin.name,
                description: roleAdmin.description,
                isActive: roleAdmin.isActive,
                permissions: permissions,
            })
        }
        
        const roleUser = INIT_ROLES.find((item) => item.name === 'USER');
        if (roleUser) {
            await this.roleModel.create({
                name: roleUser.name,
                description: roleUser.description,
                isActive: roleUser.isActive,
                permissions: [],
            })
        }
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: 'ADMIN' });
        const userRole = await this.roleModel.findOne({ name: 'USER' });
        
        for (const user of INIT_USERS) {
            let roleId = userRole?._id;
            if (user.role === 'ADMIN') roleId = adminRole?._id;

            await this.userModel.create({
                ...user,
                password: this.userService.getHashPassword(this.configService.get<string>('INIT_PASSWORD') ?? "123456"),
                role: roleId
            });
        }
      }

      const countCompany = await this.companyModel.countDocuments({});
      const countJob = await this.jobModel.countDocuments({});
      const countResume = await this.resumeModel.countDocuments({});
      const countSubscriber = await this.subscriberModel.countDocuments({});

      if (countCompany === 0) {
        await this.companyModel.insertMany(INIT_COMPANIES);
      }
      if (countJob === 0) {
        await this.jobModel.insertMany(INIT_JOBS);
      }
      if (countResume === 0) {
        await this.resumeModel.insertMany(INIT_RESUMES);
      }
      if (countSubscriber === 0) {
        await this.subscriberModel.insertMany(INIT_SUBSCRIBERS);
      }

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA');
      }
    }
  }
}
