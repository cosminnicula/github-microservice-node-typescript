import express from 'express';

import { CommonRoutesConfig } from '../application/config/commonRoutes.config';
import { getRepositories } from './controllers/stats.controller';

export class StatsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'StatsRoutes');
  }

  configureRoutes() {
    this.app
      .route('/api/v1/stats/repository-branches')
      .get(getRepositories);

    return this.app;
  }
}
