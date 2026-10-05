import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User as UserM } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import type { IUser } from './users.interface';
import { User } from '../decorator/customize';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {

  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) { }
  getHashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto, user: IUser) {

    // async create(email: string, password: string, name: string) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException("Email ddax toonf taij");
    }
    const hashPassword = this.getHashPassword(createUserDto.password);
    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword,
      age, gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)

      .sort(sort as any)
      .select("-password")
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user";
    }
    return await this.userModel.findOne({
      _id: id
    }).select("-password");
  }

  findOneByUsername(username: string) {

    return this.userModel.findOne({
      email: username
    });
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }


  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      }
    )
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user";
    }
    await this.userModel.updateOne(
      { _id: id },
      {

        deletedBy: {
          _id: user._id,
          email: user.email
        }

      }
    )
    return this.userModel.softDelete({
      _id: id
    }
    );
  }

  async register(user: RegisterUserDto) {
    // async create(email: string, password: string, name: string) {
    const { name, email, password, age, gender, address } = user;
    //check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException("Email ddax toonf taij");
    }
    const hashPassword = this.getHashPassword(user.password);
    let newRegister = await this.userModel.create({
      name,
      email, password: hashPassword,
      age,
      gender,
      address,
      role: "USER"
    })
    return newRegister;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken

      }
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne(

      {
        refreshToken

      }
    )
  }


}
