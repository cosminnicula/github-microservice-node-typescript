export type RepositoryBranchesEntity = {
  repositoryName: string,
  repositoryOwner: string,
  branches: [{
    name: string,
    commitSha: string
  }]
};