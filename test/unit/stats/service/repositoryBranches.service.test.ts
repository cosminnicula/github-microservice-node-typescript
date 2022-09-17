import { getAllRepositoriesAndBranches } from '../../../../src/stats/service/repositoryBranches.service';

import { RepositoryEntity } from '../../../../src/upstream/repository/entity/repository.entity';
import { BranchEntity } from '../../../../src/upstream/repository/entity/branch.entity';
import * as BranchService from '../../../../src/upstream/repository/service/branch.service';
import * as RepositoryService from '../../../../src/upstream/repository/service/repository.service';
import { RepositoryBranchesEntity } from '../../../../src/stats/entity/repositoryBranches.entity';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('RepositoryBranches Service', () => {
  test('should return empty array when no repositories found', async () => {
    const expectedRepositoriesResponse: RepositoryEntity[] = [];
    const expectedBranchesResponse: BranchEntity[] = [];

    jest
      .spyOn(RepositoryService, 'getAllReposByUsername')
      .mockResolvedValueOnce(expectedRepositoriesResponse);

    jest
      .spyOn(BranchService, 'getAllBranchesByRepositoryName')
      .mockResolvedValueOnce(expectedBranchesResponse);

    expect(await getAllRepositoriesAndBranches('u')).toEqual([]);
  });

  test('should return non-empty array when repositories and branches found', async () => {
    const expectedRepositoriesResponse: RepositoryEntity[] = [{
      name: 'r1',
      owner: {
        login: 'u1'
      },
      fork: false
    }];
    jest
      .spyOn(RepositoryService, 'getAllReposByUsername')
      .mockResolvedValueOnce(expectedRepositoriesResponse);

    const expectedBranchesResponse: BranchEntity[] = [{
      name: 'b1',
      commit: {
        sha: '15610ccc7244c6a289944d1f4e39635371248f00'
      }
    }];
    jest
      .spyOn(BranchService, 'getAllBranchesByRepositoryName')
      .mockResolvedValueOnce(expectedBranchesResponse);

    const repositoriesAndBranches: RepositoryBranchesEntity[] = await getAllRepositoriesAndBranches('u');

    expect(repositoriesAndBranches.length).toEqual(1);
    expect(repositoriesAndBranches[0].branches.length).toEqual(1);
    expect(repositoriesAndBranches[0].repositoryOwner).toEqual(expectedRepositoriesResponse[0].owner.login);
    expect(repositoriesAndBranches[0].repositoryName).toEqual(expectedRepositoriesResponse[0].name);
    expect(repositoriesAndBranches[0].branches[0].name).toEqual(expectedBranchesResponse[0].name);
    expect(repositoriesAndBranches[0].branches[0].commitSha).toEqual(expectedBranchesResponse[0].commit.sha);
  });

  test('should exclude forked repositories', async () => {
    const repositories: RepositoryEntity[] = [{
      name: 'r1',
      owner: {
        login: 'u1'
      },
      fork: true
    }];
    jest
      .spyOn(RepositoryService, 'getAllReposByUsername')
      .mockResolvedValueOnce(repositories);

    jest
      .spyOn(BranchService, 'getAllBranchesByRepositoryName')
      .mockResolvedValueOnce([]);

    const repositoriesAndBranches: RepositoryBranchesEntity[] = await getAllRepositoriesAndBranches('u');

    expect(repositoriesAndBranches.length).toEqual(0);
  });
});