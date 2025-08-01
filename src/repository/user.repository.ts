import { PrismaClient, User } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest } from '../types/user.types';

const prisma = new PrismaClient();

export class UserRepository {
  async create(userData: CreateUserRequest & { hashedPassword: string }): Promise<User> {
    const { password, hashedPassword, ...data } = userData;
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, userData: UpdateUserRequest): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ✅ Soft delete instead of hard delete
  async delete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async count(): Promise<number> {
    return prisma.user.count({
      where: { deletedAt: null },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return !!user;
  }

  // ✅ Optional: Restore soft-deleted user
  async restore(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}

export const userRepository = new UserRepository();
