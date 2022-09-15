import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GitHubUsernameNotFoundException } from '../gitHubUsernameNotFoundException.entity';
import { UnauthorizedException } from '../unauthorizedException.entity';

export function handleHttpError(
  e: Error,
  request: Request,
  response: Response,
  next: NextFunction // eslint-disable-line
): void {
  if (e instanceof GitHubUsernameNotFoundException) {
    response.status(StatusCodes.NOT_FOUND).send({
      message: e.message,
      status: StatusCodes.NOT_FOUND
    });
  } else if (e instanceof UnauthorizedException) {
    response.status(StatusCodes.UNAUTHORIZED).send({
      message: e.message,
      status: StatusCodes.UNAUTHORIZED
    });
  } else {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: e.message,
      status: StatusCodes.INTERNAL_SERVER_ERROR
    });
  }
}