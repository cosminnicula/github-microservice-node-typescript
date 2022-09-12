import repositoryService from '../../upstream/repository/service/repository.service';
import branchService from '../../upstream/repository/service/branch.service';
import { RepositoryBranchesEntity } from '../entity/repositoryBranches.entity';

class RepositoryBranchesService {
  async getAllRepositoriesAndBranches(username: string) {
    const repositories = await repositoryService.getAllReposByUsername(username);

    const repositoryBranches: any[] = [];

    await Promise.all(repositories.map(async (repository) => {
      const branches = await branchService.getAllBranchesByRepositoryName(username, repository.name);
      repositoryBranches.push({
        repositoryName: repository.name,
        repositoryOwner: repository.owner.login,
        branches
      })
    }));

    return repositoryBranches;
  }
}

export default new RepositoryBranchesService();
