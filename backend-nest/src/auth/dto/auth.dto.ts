import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  company_address: string;

  @IsString()
  @IsNotEmpty()
  company_phone: string;

  @IsString()
  @IsIn(['Retail', 'Manufacturing', 'Healthcare', 'Technology', 'Other'])
  industry: string;

  @IsString()
  @IsOptional()
  tax_id?: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
