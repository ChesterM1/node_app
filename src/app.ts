import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { loggerInterface } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { ConfigServiceInterface } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.loggerInterface) private logger: loggerInterface,
		@inject(TYPES.UserControllerInterface) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.port = 8000;
		this.app = express();
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`server work to port ${this.port}`);
	}
}
