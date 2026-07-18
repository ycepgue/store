-- AlterTable: добавляем роль пользователя (по умолчанию обычный пользователь).
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
