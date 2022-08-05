import { NextFunction, Request, Response, Router } from 'express';
import { middlewareInterface } from './middlewareInterface';

export interface RouterInterface {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	middleware?: middlewareInterface[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
