import express from 'express';

import { CommonRoutesConfig } from '../common/common.routes.config';
import StatsController from './controllers/stats.controller';

export class StatsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'StatsRoutes');
  }

  configureRoutes() {
    this.app
      .route('/api/v1/stats/repository-branches')
      .get(StatsController.getRepositories);

    return this.app;
  }
}
