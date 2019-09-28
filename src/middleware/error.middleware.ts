import { NextFunction, Request, Response } from 'express';
import PriceCostException from '../error/PriceCostException';

function errorMiddleware(error: PriceCostException, request: Request, response: Response, next: NextFunction): void {
    if (error.status) {
        response.statusCode = error.status;
        response.statusMessage = error.message;
        next();
    }
}

export default errorMiddleware;
