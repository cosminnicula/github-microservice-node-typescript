import 'jest';
import { AxiosError, AxiosResponse } from 'axios';
import * as http from 'http';
import { Application, } from 'express';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import application from '../../application';
import { RepositoryBranchesEntity } from '../../src/stats/entity/repositoryBranches.entity';
import axiosClient from '../../src/application/config/api.config';
import { UnauthorizedException } from '../../src/application/exception/unauthorizedException.entity';
import { RepositoryEntity } from '../../src/upstream/repository/entity/repository.entity';
import { BranchEntity } from '../../src/upstream/repository/entity/branch.entity';

describe('Application integration tests with mocked upstream', () => {
  let applicationInstance: Application;

  let serverInstance: http.Server

  beforeAll(async () => {
    applicationInstance = application;
    serverInstance = application.listen(0);
  });

  afterAll(async () => {
    serverInstance.close();
  });

  test('should return correct number of items and data when username exists', async () => {
    const repositoriesReponse: RepositoryEntity[] = [{
      name: 'r1',
      owner: {
        login: 'u1'
      },
      fork: false
    }, {
      name: 'r2',
      owner: {
        login: 'u1'
      },
      fork: false
    }];
    const branchesResponse: BranchEntity[] = [{
      name: 'b1',
      commit: {
        sha: '15610ccc7244c6a289944d1f4e39635371248f00'
      }
    }];

    jest
      .spyOn(axiosClient, 'get')
      .mockImplementation((url) => {
        if (url.startsWith('/users')) {
          return Promise.resolve({
            data: repositoriesReponse,
          });
        }
        return Promise.resolve({
          data: branchesResponse
        });
      });

    await request(applicationInstance)
      .get('/api/v1/stats/repository-branches?username=u1}')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body.length).toBe(2);
        expect(res.body.find((repository: RepositoryBranchesEntity) =>
          repository.repositoryOwner === repositoriesReponse[0].owner.login &&
          repository.repositoryName === repositoriesReponse[0].name
        )).toBeDefined();
        expect(res.body.find((repository: RepositoryBranchesEntity) =>
          repository.branches.find((branch) =>
            branch.name === branchesResponse[0].name &&
            branch.commitSha === branchesResponse[0].commit.sha)
        )).toBeDefined();
      })
  });

  test('should return 404 when user does not exists', async () => {
    const expectedUsername = 'dummy';

    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', '', undefined, null, { status: StatusCodes.NOT_FOUND } as any as AxiosResponse); });

    await request(applicationInstance)
      .get(`/api/v1/stats/repository-branches?username=${expectedUsername}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.NOT_FOUND)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Username ${expectedUsername} not found.`);
      })
  });

  test('should return 401 when request is not authorized', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new UnauthorizedException('Not authorized'); });

    await request(applicationInstance)
      .get('/api/v1/stats/repository-branches?username=u1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.UNAUTHORIZED)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Not authorized`);
      })
  });
});