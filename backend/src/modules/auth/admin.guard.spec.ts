import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

function contextWithUser(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('пропускает администратора', () => {
    const ctx = contextWithUser({ id: 1, email: 'a@b.com', role: 'admin' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('блокирует обычного пользователя', () => {
    const ctx = contextWithUser({ id: 2, email: 'u@b.com', role: 'user' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('блокирует запрос без пользователя', () => {
    const ctx = contextWithUser(undefined);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
