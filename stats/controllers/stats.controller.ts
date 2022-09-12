import { Request, Response, NextFunction } from 'express';

import repositoryBranchesService from '../services/repositoryBranches.service';

class StatsController {
  async getRepositories(request: Request, response: Response, next: NextFunction) {
    try {
      const repositories = await repositoryBranchesService.getAllRepositoriesAndBranches(request.query.username as string);
      response.status(200).send(repositories);
    } catch (e) {
      next(e);
    }
  }
}

export default new StatsController();
