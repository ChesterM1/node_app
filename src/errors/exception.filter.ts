import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { loggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ExceptionFilterInterface } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
	constructor(@inject(TYPES.loggerInterface) private logger: loggerInterface) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			res.status(500).send(err.message);
		}
	}
}
