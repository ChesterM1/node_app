import { ClassConstructor, plainToClass } from 'class-transformer';
import { NextFunction, Response, Request } from 'express';
import { middlewareInterface } from './middlewareInterface';
import { validate } from 'class-validator';

export class ValidateMiddleware implements middlewareInterface {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
