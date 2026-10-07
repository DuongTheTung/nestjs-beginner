import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @IsNotEmpty()
  @IsObject()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
