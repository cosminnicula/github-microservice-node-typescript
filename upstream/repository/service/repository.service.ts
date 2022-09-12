import axios from 'axios';

import { GenericException } from '../../../common/exception/genericException.entity';
import { GitHubUsernameNotFoundException } from '../../../common/exception/gitHubUsernameNotFoundException.entity';
import { RepositoryEntity } from '../entity/repository.entity';

class RepositoryService {
  async getAllReposByUsername(username: string) {
    try {
      const { data } = await axios.get<RepositoryEntity[]>(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `token ${'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'}`
          },
        },
      );

      return data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.code === 'ERR_BAD_REQUEST') {
          console.log(`An exception occurred while retrieving all repositories for ${username} user:`, e.message);
          throw new GitHubUsernameNotFoundException(`Username ${username} not found.`);
        }
        console.log(`An exception occurred:`, e.message);
        throw new GenericException(e.message);
      } else {
        console.log(`An exception occurred:`, e as string);
        throw new GenericException(e as string);
      }
    }
  }
}

export default new RepositoryService();