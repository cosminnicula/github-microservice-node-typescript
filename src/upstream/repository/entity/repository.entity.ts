export type RepositoryEntity = {
  name: string,
  owner: {
    login: string
  },
  fork: boolean
};