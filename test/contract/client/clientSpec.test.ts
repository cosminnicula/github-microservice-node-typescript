import 'jest';
import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

import StatsClient from '../../../src/client/stats.client';
import { RepositoryBranchesEntity } from '../../../src/stats/entity/repositoryBranches.entity';

describe('Client contract tests', () => {
  const mockServerPort = 1234;
  const mockServerBaseUrl = `http://localhost:${mockServerPort}/api/v1`;

  const provider = new PactV3({
    consumer: 'GitHubClient',
    provider: 'GitHubServer',
    port: mockServerPort,
    dir: path.resolve(process.cwd(), 'test', 'contract', 'pacts'),
  });

  test('should return correct number of items and data for a given username', () => {
    const repositoryBranchesEntityResponse: RepositoryBranchesEntity[] = [{
      repositoryName: 'r1',
      repositoryOwner: 'u1',
      branches: [{
        name: 'b1',
        commitSha: '15610ccc7244c6a289944d1f4e39635371248f00'
      }]
    }];

    provider
      .uponReceiving('a GET request for retrieving all repositories and branches for a specific user')
      .withRequest({
        method: 'GET',
        path: '/api/v1/stats/repository-branches',
        query: { username: MatchersV3.like(repositoryBranchesEntityResponse[0].repositoryOwner) }
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: MatchersV3.like(repositoryBranchesEntityResponse)
      });

    return provider.executeTest(async () => {
      const statsClient = new StatsClient(mockServerBaseUrl);

      return statsClient
        .getRepositoryBranchesByUsername(repositoryBranchesEntityResponse[0].repositoryOwner)
        .then((res) => {
          expect(res.data.find((repository: RepositoryBranchesEntity) => {
            return repository.repositoryOwner === repositoryBranchesEntityResponse[0].repositoryOwner &&
              repository.repositoryName === repositoryBranchesEntityResponse[0].repositoryName &&
              repository.branches[0].name === repositoryBranchesEntityResponse[0].branches[0].name &&
              repository.branches[0].commitSha === repositoryBranchesEntityResponse[0].branches[0].commitSha ;
          })).toBeDefined();
        })
    });
  });
});