import axiosClient from '../../../common/config/api.config';
import { GenericException } from '../../../common/exception/genericException.entity';
import { BranchEntity } from '../entity/branch.entity';

export async function getAllBranchesByRepositoryName(username: string, repositoryName: string) {
  try {
    const { data } = await axiosClient.get<BranchEntity[]>(
      `/repos/${username}/${repositoryName}/branches`
    );

    return data;
  } catch (e) {
    console.log(`An exception occurred:`, e as string);
    throw new GenericException(e as string);
  }
}