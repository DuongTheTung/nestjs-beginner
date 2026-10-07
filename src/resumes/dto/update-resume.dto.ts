import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateResumeDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
