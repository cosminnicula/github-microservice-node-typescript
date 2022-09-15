import axios from 'axios';
import { StatusCodes } from 'http-status-codes'

import axiosClient from '../../../application/config/api.config';
import { GitHubUsernameNotFoundException } from '../../../application/exception/gitHubUsernameNotFoundException.entity';
import { RepositoryEntity } from '../entity/repository.entity';

export async function getAllReposByUsername(username: string): Promise<RepositoryEntity[]> {
  try {
    const { data }: { data: RepositoryEntity[] } = await axiosClient.get<RepositoryEntity[]>(
      `/users/${username}/repos`
    );

    return data;
  } catch (e) {
    const message = `An exception occurred while retrieving all repositories for user=${username}:`;
    if (axios.isAxiosError(e)) {
      if (e.response?.status === StatusCodes.NOT_FOUND) {
        console.log(message, e.message);
        throw new GitHubUsernameNotFoundException(`Username ${username} not found.`);
      }
    }
    console.log(message, JSON.stringify(e));
    throw e;
  }
}