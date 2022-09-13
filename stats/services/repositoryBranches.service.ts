import { getAllReposByUsername } from '../../upstream/repository/service/repository.service';
import { getAllBranchesByRepositoryName } from '../../upstream/repository/service/branch.service';
import { RepositoryBranchesEntity } from '../entity/repositoryBranches.entity';

export async function getAllRepositoriesAndBranches(username: string) {
  const repositories = await getAllReposByUsername(username);

  const repositoryBranches: any[] = [];

  await Promise.all(repositories.map(async (repository) => {
    const branches = await getAllBranchesByRepositoryName(username, repository.name);
    repositoryBranches.push({
      repositoryName: repository.name,
      repositoryOwner: repository.owner.login,
      branches
    })
  }));

  return repositoryBranches;
}