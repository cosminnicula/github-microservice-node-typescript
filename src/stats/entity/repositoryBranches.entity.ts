export type RepositoryBranchesEntity = {
  repositoryName: string,
  repositoryOwner: string,
  branches: Array<{
    name: string,
    commitSha: string
  }>
};