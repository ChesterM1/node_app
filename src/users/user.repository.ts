import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { UserModel } from '@prisma/client';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserLoginDto } from '../dto/user.login.dto';

@injectable()
export class UserRepository implements UserRepositoryInterface {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ name, password, email }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				name,
				password,
				email,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: { email },
		});
	}
}
