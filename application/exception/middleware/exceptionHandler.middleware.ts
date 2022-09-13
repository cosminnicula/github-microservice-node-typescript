import { NextFunction, Request, Response } from "express";

import { GitHubUsernameNotFoundException } from '../gitHubUsernameNotFoundException.entity';

export function handleHttpError(
  e: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (e instanceof GitHubUsernameNotFoundException) {
    response.status(404).send({
      message: e.message,
      status: 404
    });
  } else {
    response.status(500).send({
      message: e.message,
      status: 500
    });
  }
}