import { Request, Response, NextFunction } from 'express';

import { getAllRepositoriesAndBranches } from '../services/repositoryBranches.service';

export async function getRepositories(request: Request, response: Response, next: NextFunction) {
  try {
    const repositories = await getAllRepositoriesAndBranches(request.query.username as string);
    response.status(200).send(repositories);
  } catch (e) {
    next(e);
  }
}