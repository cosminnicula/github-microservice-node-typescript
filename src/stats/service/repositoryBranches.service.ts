import { getAllReposByUsername } from '../../upstream/repository/service/repository.service';
import { getAllBranchesByRepositoryName } from '../../upstream/repository/service/branch.service';
import { RepositoryBranchesEntity } from '../entity/repositoryBranches.entity';
import { RepositoryEntity } from '../../upstream/repository/entity/repository.entity';
import { BranchEntity } from '../../upstream/repository/entity/branch.entity';

export async function getAllRepositoriesAndBranches(username: string): Promise<RepositoryBranchesEntity[]> {
  const repositories: RepositoryEntity[] = await getAllReposByUsername(username);

  return Promise.all(repositories
    .filter((repository) => !repository.fork)
    .map(async (repository) => {
      const branches: BranchEntity[] = await getAllBranchesByRepositoryName(username, repository.name);
      return {
        repositoryName: repository.name,
        repositoryOwner: repository.owner.login,
        branches: branches.map(branch => ({
          name: branch.name,
          commitSha: branch.commit.sha
        }))
      };
    }));
}