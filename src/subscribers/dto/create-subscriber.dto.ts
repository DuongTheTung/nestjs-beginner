import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsArray()
  skills: string[];
}
