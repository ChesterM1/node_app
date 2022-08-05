import { Request, Response, NextFunction } from 'express';

export interface middlewareInterface {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
