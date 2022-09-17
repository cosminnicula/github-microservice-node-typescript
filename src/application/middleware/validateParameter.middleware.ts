import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function validateRequiredParameter(parameterName: string) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (request.query[parameterName] === undefined) {
      response.status(StatusCodes.BAD_REQUEST).send({
        message: `Missing ${parameterName} parameter.`,
        status: StatusCodes.BAD_REQUEST
      });
    } else {
      next();
    }
  };
}