import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthUserDto {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export class AuthResponseDto {
  token: string;
  user: AuthUserDto;
}
