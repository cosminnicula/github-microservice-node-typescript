import 'jest';
import * as http from 'http';
import { Application, } from 'express';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import application from '../../application';
import { RepositoryBranchesEntity } from '../../src/stats/entity/repositoryBranches.entity';
import axiosClient from '../../src//application/config/api.config';

describe('Application integration tests', () => {
  let applicationInstance: Application;

  let serverInstance: http.Server

  const username = "cosminnicula";

  const dummyUsername = "abc1816453621721xyz";

  const dummyAuthorizationToken = "dummy";

  const repositoriesNumber = 17;

  beforeAll(async () => {
    applicationInstance = application;
    serverInstance = application.listen(0);
  });

  afterAll(async () => {
    serverInstance.close();
  });

  test('should return correct number of items and data when username exists', async () => {
    await request(applicationInstance)
      .get(`/api/v1/stats/repository-branches?username=${username}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body.length).toBe(repositoriesNumber);
        expect(res.body.find((repository: RepositoryBranchesEntity) => {
          return repository.repositoryOwner === 'cosminnicula' &&
            repository.repositoryName === 'go-playground';
        })).toBeDefined();
      })
  });

  test('should return 404 when user does not exists', async () => {
    await request(applicationInstance)
      .get(`/api/v1/stats/repository-branches?username=${dummyUsername}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.NOT_FOUND)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Username ${dummyUsername} not found.`);
      })
  });

  test('should return 406 when media type is not acceptable', async () => {
    await request(applicationInstance)
      .get(`/api/v1/stats/repository-branches?username=${dummyUsername}`)
      .set('Accept', 'application/xml')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.NOT_ACCEPTABLE)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Media type application/xml not supported.`);
      })
  });

  test('should return 401 when request is not authorized', async () => {
    axiosClient.defaults.headers.common['Authorization'] = `token ${dummyAuthorizationToken}`;

    await request(applicationInstance)
      .get(`/api/v1/stats/repository-branches?username=${dummyUsername}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.UNAUTHORIZED)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Not authorized`);
      })

    axiosClient.defaults.headers.common['Authorization'] = `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`;
  });

  test('should return 400 when username parameter is missing', async () => {
    await request(applicationInstance)
      .get(`/api/v1/stats/repository-branches`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.BAD_REQUEST)
      .expect((res: request.Response) => {
        expect(res.body.message).toBe(`Missing username parameter.`);
      })
  });
});