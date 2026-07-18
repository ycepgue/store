import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma/prisma.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  const jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') };
  const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
    jwt.sign.mockReturnValue('signed.jwt.token');
  });

  describe('register', () => {
    it('создаёт пользователя и возвращает токен', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcryptMock.hash.mockResolvedValue('hashed' as never);
      prisma.user.create.mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        name: 'Аня',
        role: 'user',
      });

      const result = await service.register({
        email: 'A@B.com',
        password: 'secret123',
        name: 'Аня',
      });

      // email нормализуется в нижний регистр
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'a@b.com' },
      });
      expect(result.token).toBe('signed.jwt.token');
      expect(result.user).toEqual({
        id: 1,
        email: 'a@b.com',
        name: 'Аня',
        role: 'user',
      });
    });

    it('бросает Conflict при существующей почте', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com' });

      await expect(
        service.register({ email: 'a@b.com', password: 'x' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('возвращает токен при верном пароле', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 2,
        email: 'a@b.com',
        name: null,
        password: 'hashed',
        role: 'admin',
      });
      bcryptMock.compare.mockResolvedValue(true as never);

      const result = await service.login({
        email: 'a@b.com',
        password: 'secret123',
      });

      expect(result.token).toBe('signed.jwt.token');
      expect(result.user.id).toBe(2);
    });

    it('бросает Unauthorized при неверном пароле', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 2,
        email: 'a@b.com',
        name: null,
        password: 'hashed',
      });
      bcryptMock.compare.mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('бросает Unauthorized, если пользователь не найден', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nope@b.com', password: 'x' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
