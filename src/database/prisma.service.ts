import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client/index';
import { loggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.loggerInterface) private logger: loggerInterface) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] connect');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PrismaService] error connect ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log('[PrismaService] disconnect');
	}
}
