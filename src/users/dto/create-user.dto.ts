import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested, IsMongoId, IsString } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    @IsMongoId({ message: 'Company ID must be a valid MongoId' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
export class CreateUserDto {

    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    age: number;


    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsMongoId({ message: 'Role must be a valid MongoId' })
    role: mongoose.Schema.Types.ObjectId;


    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}

export class RegisterUserDto extends OmitType(
    CreateUserDto,
    ['role', 'company'] as const,
) {}

export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'admin@gmail.com', description: 'username' })
    readonly username: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'password',
    })
    readonly password: string;
}
