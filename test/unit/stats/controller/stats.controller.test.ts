import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GitHubUsernameNotFoundException } from '../../../../src/application/exception/gitHubUsernameNotFoundException.entity';
import { getRepositories } from '../../../../src/stats/controller/stats.controller';

import * as RepositoriesAndBranchesService from '../../../../src/stats/service/repositoryBranches.service';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('RepositoryBranches Service', () => {
  test('should return 200 when user is valid', async () => {
    jest
      .spyOn(RepositoriesAndBranchesService, 'getAllRepositoriesAndBranches')
      .mockResolvedValueOnce([]);

      const requestMock: Request = { query: { username: 'u' } } as any as Request;
      const responseMock: Response = { status: jest.fn()} as any as Response;
      const nextFunctionMock: jest.Mock = jest.fn();

      await getRepositories(requestMock, responseMock, nextFunctionMock);
      
      expect(responseMock.status).toBeCalledWith(StatusCodes.OK);
  });

  test('should return 404 when user is not found', async () => {
    jest
      .spyOn(RepositoriesAndBranchesService, 'getAllRepositoriesAndBranches')
      .mockImplementationOnce(() => { throw new GitHubUsernameNotFoundException(''); });

    const requestMock: Request = { query: { username: 'u' } } as any as Request;
    const responseMock: Response = { status: jest.fn()} as any as Response;
    const nextFunctionMock: jest.Mock = jest.fn();

    await getRepositories(requestMock, responseMock, nextFunctionMock);
  
    expect(nextFunctionMock.mock.calls[0][0]).toBeInstanceOf(GitHubUsernameNotFoundException);
  });
});