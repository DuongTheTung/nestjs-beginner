import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    name: string;

    phone: string;

    age: string;

    address: string;

    createdAt: Date;

    updatedAt: Date;
}
