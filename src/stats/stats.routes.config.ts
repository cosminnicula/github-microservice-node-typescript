import { Application } from 'express';

import { CommonRoutesConfig } from '../application/config/commonRoutes.config';
import { getRepositories } from './controller/stats.controller';
import { validateRequiredParameter } from '../application/middleware/validateParameter.middleware';

export class StatsRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'StatsRoutes');
  }

  configureRoutes(): Application {
    this.app
      .get('/api/v1/stats/repository-branches', validateRequiredParameter('username'), getRepositories);

    return this.app;
  }
}
