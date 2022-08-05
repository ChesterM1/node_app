import { baseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { loggerInterface } from '../logger/logger.interface';
import { UserControllerInterface } from './user.controller.interface';
import 'reflect-metadata';
import { UserLoginDto } from '../dto/user.login.dto';
import { UserRegisterDto } from '../dto/user.register.dto';
import { UserServiceInterface } from './user.service.interface';
import { HTTPError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middlewere';

@injectable()
export class UserController extends baseController implements UserControllerInterface {
	constructor(
		@inject(TYPES.loggerInterface) logger: loggerInterface,
		@inject(TYPES.UserService) private userService: UserServiceInterface,
	) {
		super(logger);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации', 'Login'));
		}
		this.ok(res, { email: body.email });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже сушествует'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
}
