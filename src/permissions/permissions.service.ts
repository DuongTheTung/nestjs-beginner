import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import type { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(`Permission with apiPath=${apiPath}, method=${method} already exists.`);
    }

    const newPermission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newPermission._id,
      createdAt: newPermission.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await this.permissionModel.findById(id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const { apiPath, method } = updatePermissionDto;
    if (apiPath || method) {
      const permissionToUpdate = await this.permissionModel.findById(id);
      if (permissionToUpdate) {
        const p_apiPath = apiPath ? apiPath : permissionToUpdate.apiPath;
        const p_method = method ? method : permissionToUpdate.method;
        const isExist = await this.permissionModel.findOne({ apiPath: p_apiPath, method: p_method });
        if (isExist && isExist._id.toString() !== id) {
          throw new BadRequestException(`Permission with apiPath=${p_apiPath}, method=${p_method} already exists.`);
        }
      }
    }

    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.permissionModel.softDelete({
      _id: id,
    });
  }
}
