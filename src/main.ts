import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { loggerInterface } from './logger/logger.interface';
import { UserServiceInterface } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { ConfigServiceInterface } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './database/prisma.service';
import { UserRepositoryInterface } from './users/user.repository.interface';
import { UserRepository } from './users/user.repository';

const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<loggerInterface>(TYPES.loggerInterface).to(LoggerService).inSingletonScope();
	bind<UserController>(TYPES.UserControllerInterface).to(UserController);
	bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<UserServiceInterface>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

	bind<App>(TYPES.Application).to(App);
});

interface BootstrapInterface {
	app: App;
	appContainer: Container;
}

function bootstrap(): BootstrapInterface {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
