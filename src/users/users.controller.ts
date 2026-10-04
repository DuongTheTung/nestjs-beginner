import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from '../decorator/customize';
import type { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new user")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    }
  }

  @Get()
  @ResponseMessage("fetch user with paginate")
  findAll(
    @Query("page") currenPage: string,
    @Query("limit") limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currenPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("fetch user by id")
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @ResponseMessage("Update a user")
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updateUser = await this.usersService.update(updateUserDto, user);
    return updateUser;
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
