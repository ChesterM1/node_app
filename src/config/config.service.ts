import { ConfigServiceInterface } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { loggerInterface } from '../logger/logger.interface';

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.loggerInterface) private logger: loggerInterface) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Не удалось прочитать фаил .env, или он отсутствует');
		} else {
			this.logger.log('[ConfigService] конфигурация .env загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
