import bcrypt from 'bcryptjs';
import { UserRepository, userRepository } from '../repository/user.repository';
import { CreateUserRequest, UpdateUserRequest, User } from '../types/user.types';
import { AppError } from '../middleware/error.middleware';
import { PaginationParams } from '../types/common.types';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(userData: CreateUserRequest): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userRepo.create({...rest,hashedPassword, });

    // Return user without password
    // If user contains password field (even if not used), destructure to remove it
    // But since in repo you're storing `hashedPassword`, it's not needed, but done just in case
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findById(id);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findByEmail(email);
    return user && !user.deletedAt ? user : null;
  }

  async getAllUsers(pagination: PaginationParams) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepo.findAll(skip, limit),
      this.userRepo.count(),
    ]);

    const filteredUsers = users.filter(user => !user.deletedAt);
    const cleanUsers = filteredUsers.map(({ password, ...u }) => u);

    return {
      users: cleanUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    };
  }

  async updateUser(id: string, updateData: UpdateUserRequest): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.update(id, updateData);

    if (!user || user.deletedAt) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async softDeleteUser(id: string): Promise<void> {
    const user = await this.userRepo.softDelete(id);
    if (!user) {
      throw new AppError('User not found or already deleted', 404);
    }
  }
}
