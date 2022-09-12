import axios from 'axios';

import { GenericException } from '../../../common/exception/genericException.entity';
import { BranchEntity } from '../entity/branch.entity';

class BranchService {
  async getAllBranchesByRepositoryName(username: string, repositoryName: string) {
    try {
      const { data } = await axios.get<BranchEntity[]>(
        `https://api.github.com/repos/${username}/${repositoryName}/branches`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `token ${'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'}`
          },
        },
      );

      return data;
    } catch (e) {
      console.log(`An exception occurred:`, e as string);
      throw new GenericException(e as string);
    }
  }
}

export default new BranchService();