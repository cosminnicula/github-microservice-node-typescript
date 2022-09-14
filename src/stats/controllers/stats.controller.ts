import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getAllRepositoriesAndBranches } from '../service/repositoryBranches.service';

export async function getRepositories(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const repositories = await getAllRepositoriesAndBranches(request.query.username as string);
    response.status(StatusCodes.OK).send(repositories);
  } catch (e) {
    next(e);
  }
}