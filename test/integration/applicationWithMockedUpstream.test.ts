import 'jest';
import { AxiosError, AxiosResponse } from 'axios';
import * as http from 'http';
import { Application, } from 'express';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import application from '../../application';
import { RepositoryBranchesEntity } from '../../src/stats/entity/repositoryBranches.entity';
import axiosClient from '../../src//application/config/api.config';
import { UnauthorizedException } from '../../src/application/exception/unauthorizedException.entity';

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
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementation((url) => {
        if (url.startsWith('/users')) {
          return Promise.resolve({
            data: [{
              name: 'r1',
              owner: {
                login: 'u1'
              }
            }, {
              name: 'r2',
              owner: {
                login: 'u1'
              }
            }],
          });
        }
        return Promise.resolve({
          data: [{
            name: 'b1',
            commit: {
              sha: '15610ccc7244c6a289944d1f4e39635371248f00'
            }
          }]
        });
      });

    await request(applicationInstance)
      .get('/api/v1/stats/repository-branches?username=u1}')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body.length).toBe(2);
        expect(res.body.find((repository: RepositoryBranchesEntity) => {
          return repository.repositoryOwner === 'u1' &&
            repository.repositoryName === 'r1';
        })).toBeDefined();
        expect(res.body.find((repository: RepositoryBranchesEntity) => {
          return repository.branches.find((branch) => branch.name === 'b1');
        })).toBeDefined();
      })
  });

  test('should return 404 when user does not exists', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', '', undefined, null, { status: StatusCodes.NOT_FOUND } as any as AxiosResponse); });

    await request(applicationInstance)
      .get('/api/v1/stats/repository-branches?username=dummy')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.NOT_FOUND)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Username dummy not found.`);
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