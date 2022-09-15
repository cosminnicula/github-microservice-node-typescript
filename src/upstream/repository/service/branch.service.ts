import axiosClient from '../../../application/config/api.config';
import { BranchEntity } from '../entity/branch.entity';

export async function getAllBranchesByRepositoryName(username: string, repositoryName: string): Promise<BranchEntity[]> {
  try {
    const { data }: { data: BranchEntity[] } = await axiosClient.get<BranchEntity[]>(
      `/repos/${username}/${repositoryName}/branches`
    );

    return data;
  } catch (e) {
    const message = `An exception occurred while retrieving all branches for repository=${repositoryName} and user=${username}:`;
    console.log(message, JSON.stringify(e));
    throw e;
  }
}