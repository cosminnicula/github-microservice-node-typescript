import 'jest';
import path from 'path';
import * as http from 'http';
import { Application, } from 'express';
import { Verifier } from '@pact-foundation/pact';

import application from '../../../application';
import axiosClient from '../../../src/application/config/api.config';
import { RepositoryEntity } from '../../../src/upstream/repository/entity/repository.entity';
import { BranchEntity } from '../../../src/upstream/repository/entity/branch.entity';

describe('Client contract tests', () => {
  let applicationInstance: Application;

  let serverInstance: http.Server;

  const mockServerPort: number = 1234;

  const mockServerBaseUrl = `http://localhost:${mockServerPort}`;

  beforeAll(async () => {
    applicationInstance = application;
    serverInstance = application.listen(mockServerPort);
  });

  afterAll(async () => {
    serverInstance.close();
  });

  test('should return correct number of items and data for a given username', () => {
    const expectedRepositoriesResponse: RepositoryEntity[] = [{
      name: 'random',
      owner: {
        login: 'random'
      },
      fork: false
    }];
    const expectedBranchesResponse: BranchEntity[] = [{
      name: 'random',
      commit: {
        sha: 'random'
      }
    }];

    jest
      .spyOn(axiosClient, 'get')
      .mockImplementation((url) => {
        if (url.startsWith('/users')) {
          return Promise.resolve({
            data: expectedRepositoriesResponse,
          });
        }
        return Promise.resolve({
          data: expectedBranchesResponse
        });
      });

    return new Verifier({
      provider: 'GitHubServer',
      providerBaseUrl: mockServerBaseUrl,
      pactUrls: [path.resolve(process.cwd(), 'test', 'contract', 'pacts', 'GitHubClient-GitHubServer.json')],
    })
      .verifyProvider();
  });
});