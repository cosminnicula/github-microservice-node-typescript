import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CommonRoutesConfig } from '../application/config/commonRoutes.config';
import { getRepositories } from './controllers/stats.controller';

export class StatsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'StatsRoutes');
  }

  configureRoutes(): express.Application {
    this.app
      .get('/api/v1/stats/repository-branches', (() => {
        return (request: Request, response: Response, next: NextFunction) => {
          if (request.query['username'] === undefined) {
            response.status(StatusCodes.BAD_REQUEST).send({
              message: `Missing username parameter.`,
              status: StatusCodes.BAD_REQUEST
            });
          } else {
            next();
          }
        }
      })(), getRepositories);

    return this.app;
  }
}
