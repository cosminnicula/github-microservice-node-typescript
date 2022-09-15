import axios from 'axios';
import { StatusCodes } from 'http-status-codes'

import axiosClient from '../../../application/config/api.config';
import { GenericException } from '../../../application/exception/genericException.entity';
import { GitHubUsernameNotFoundException } from '../../../application/exception/gitHubUsernameNotFoundException.entity';
import { UnauthorizedException } from '../../../application/exception/unauthorizedException.entity';
import { RepositoryEntity } from '../entity/repository.entity';

export async function getAllReposByUsername(username: string): Promise<RepositoryEntity[]> {
  try {
    const { data }: { data: RepositoryEntity[] } = await axiosClient.get<RepositoryEntity[]>(
      `/users/${username}/repos`
    );

    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === StatusCodes.NOT_FOUND) {
        console.log(`An exception occurred while retrieving all repositories for ${username} user:`, e.message);
        throw new GitHubUsernameNotFoundException(`Username ${username} not found.`);
      } else if (e.response?.status === StatusCodes.UNAUTHORIZED) {
        console.log(`Unauthorized request:`, e.message);
        throw new UnauthorizedException('Unauthorized request');
      }
      console.log(`An exception occurred:`, e.message);
      throw new GenericException(e.message);
    } else {
      console.log(`An exception occurred:`, JSON.stringify(e));
      throw new GenericException(e as string);
    }
  }
}