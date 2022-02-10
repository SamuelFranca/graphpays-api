import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, MaxDate } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  taxId:string;

  @IsNotEmpty()
  country:string;

}
