import { AxiosError } from 'axios';
import axiosClient from '../../../../../src/application/config/api.config';
import { GenericException } from '../../../../../src/application/exception/genericException.entity';
import { GitHubUsernameNotFoundException } from '../../../../../src/application/exception/gitHubUsernameNotFoundException.entity';
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

    const data = await getAllReposByUsername('u');

    expect(data.length).toEqual(2);
  });

  test('should throw GitHubUsernameNotFoundException when username does not exists', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', 'ERR_BAD_REQUEST'); });

      expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(GitHubUsernameNotFoundException);
  });

  test('should throw GenericException when request fails with non-ERR_BAD_REQUEST AxiosError', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new AxiosError('', 'ERR_CONNECTION_REFUSED'); });

      expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(GenericException);
  });

  test('should throw GenericException when request fails with any type of error', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new Error(); });

      expect(getAllReposByUsername('u')).rejects.toBeInstanceOf(GenericException);
  });
});