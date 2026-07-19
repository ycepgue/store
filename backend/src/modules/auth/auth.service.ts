import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
} from './dto/auth.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Пользователь с такой почтой уже существует');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email, password, name: dto.name?.trim() || null },
    });

    return this.buildResponse(user.id, user.email, user.name, user.role);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Неверная почта или пароль');
    }

    return this.buildResponse(user.id, user.email, user.name, user.role);
  }

  private buildResponse(
    id: number,
    email: string,
    name: string | null,
    role: string,
  ): AuthResponseDto {
    const token = this.jwt.sign({ sub: id, email, role } satisfies JwtPayload);
    return { token, user: { id, email, name, role } };
  }
}
