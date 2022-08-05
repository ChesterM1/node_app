import { IsEmail, IsString } from 'class-validator';
import { injectable } from 'inversify';

@injectable()
export class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указан email или пароль' })
	email: string;
	@IsString({ message: 'Неверно указан email или пароль' })
	password: string;
}
