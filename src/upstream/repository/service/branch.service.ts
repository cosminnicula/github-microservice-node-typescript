import axiosClient from '../../../application/config/api.config';
import { GenericException } from '../../../application/exception/genericException.entity';
import { BranchEntity } from '../entity/branch.entity';

export async function getAllBranchesByRepositoryName(username: string, repositoryName: string): Promise<BranchEntity[]> {
  try {
    const { data }: { data: BranchEntity[] } = await axiosClient.get<BranchEntity[]>(
      `/repos/${username}/${repositoryName}/branches`
    );

    return data;
  } catch (e) {
    console.log(`An exception occurred:`, JSON.stringify(e));
    throw new GenericException(e as string);
  }
}