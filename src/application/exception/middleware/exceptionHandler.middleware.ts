import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GitHubUsernameNotFoundException } from '../gitHubUsernameNotFoundException.entity';

export function handleHttpError(
  e: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (e instanceof GitHubUsernameNotFoundException) {
    response.status(StatusCodes.NOT_FOUND).send({
      message: e.message,
      status: StatusCodes.NOT_FOUND
    });
  } else {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: e.message,
      status: StatusCodes.INTERNAL_SERVER_ERROR
    });
  }
}