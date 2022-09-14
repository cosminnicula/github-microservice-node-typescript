import { getAllRepositoriesAndBranches } from '../../../../src/stats/service/repositoryBranches.service';

import { RepositoryEntity } from '../../../../src/upstream/repository/entity/repository.entity';
import { BranchEntity } from '../../../../src/upstream/repository/entity/branch.entity';
import * as BranchService from '../../../../src/upstream/repository/service/branch.service';
import * as RepositoryService from '../../../../src/upstream/repository/service/repository.service';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('RepositoryBranches Service', () => {
  test('should return empty array when no repositories found', async () => {
    jest
      .spyOn(RepositoryService, 'getAllReposByUsername')
      .mockResolvedValueOnce([]);

    jest
      .spyOn(BranchService, 'getAllBranchesByRepositoryName')
      .mockResolvedValueOnce([]);

    expect(await getAllRepositoriesAndBranches('u')).toEqual([]);
  });

  test('should return non-empty array when repositories and branches found', async () => {
    const repositories: RepositoryEntity[] = [{
      name: 'r1',
      owner: {
        login: 'u1'
      }
    }];
    jest
      .spyOn(RepositoryService, 'getAllReposByUsername')
      .mockResolvedValueOnce(repositories);

    const branches: BranchEntity[] = [{
      name: 'b1',
      commit: {
        sha: '15610ccc7244c6a289944d1f4e39635371248f00'
      }
    }];
    jest
      .spyOn(BranchService, 'getAllBranchesByRepositoryName')
      .mockResolvedValueOnce(branches);

    const repositoriesAndBranches = await getAllRepositoriesAndBranches('u');

    expect(repositoriesAndBranches.length).toEqual(1);
    expect(repositoriesAndBranches[0].branches.length).toEqual(1);
  });
});