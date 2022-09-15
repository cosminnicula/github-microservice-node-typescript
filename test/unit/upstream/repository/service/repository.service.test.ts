import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes'

import axiosClient from '../../../../../src/application/config/api.config';
import { GenericException } from '../../../../../src/application/exception/genericException.entity';
import { GitHubUsernameNotFoundException } from '../../../../../src/application/exception/gitHubUsernameNotFoundException.entity';
import { UnauthorizedException } from '../../../../../src/application/exception/unauthorizedException.entity';
import { RepositoryEntity } from '../../../../../src/upstream/repository/entity/repository.entity';
import { getAllReposByUsername } from '../../../../../src/upstream/repository/service/repository.service';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Repository Service', () => {
  test('should return non-empty array when called', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockResolvedValueOnce({
        data: [{
          name: 'r1',
          owner: {
            login: 'u1'
          }
        }, {
          name: 'r2',
          owner: {
            login: 'u1'
          }
        }],
      });

    const data: RepositoryEntity[] = await getAllReposByUsername('u');

    expect(data.length).toEqual(2);
  });

  test('should throw GitHubUsernameNotFoundException when request fails with 404 AxiosError', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', '', undefined, null, { status: StatusCodes.NOT_FOUND } as any as AxiosResponse) });

    expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(GitHubUsernameNotFoundException);
  });

  test('should throw GenericException when request fails with unknown AxiosError', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', '', undefined, null, { status: StatusCodes.BAD_GATEWAY } as any as AxiosResponse) });

    expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(GenericException);
  });

  test('should throw UnauthorizedException when request is not authorized', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', '', undefined, null, { status: StatusCodes.UNAUTHORIZED } as any as AxiosResponse) });

    expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  test('should throw GenericException when request fails with unknown error', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new Error(); });

    expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(GenericException);
  });
});