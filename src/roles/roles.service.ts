import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import type { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name } = createRoleDto;
    const isExist = await this.roleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`Role with name=${name} already exists.`);
    }

    const newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
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
      throw new BadRequestException("not found role");
    }
    const role = await this.roleModel.findById(id);
    if (!role) return null;
    return role.populate({
      path: "permissions",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name } = updateRoleDto;
    if (name) {
      const isExist = await this.roleModel.findOne({ name });
      if (isExist && isExist._id.toString() !== id) {
        throw new BadRequestException(`Role with name=${name} already exists.`);
      }
    }

    return await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if (!foundRole) return null;
    if (foundRole.name === 'ADMIN' || foundRole.name === 'Admin') {
      throw new BadRequestException("Cannot delete ADMIN role");
    }

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.roleModel.softDelete({
      _id: id,
    });
  }
}
