import { inject, injectable } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserServiceInterface } from './user.service.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements UserServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
	) {}

	async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(name, email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.userRepository.find(email);

		if (existedUser) {
			return null;
		}
		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);

		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.name, existedUser.email, existedUser.password);
		return newUser.comparePassword(password);
	}
}
