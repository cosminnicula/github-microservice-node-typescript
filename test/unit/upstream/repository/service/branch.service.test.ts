import axiosClient from '../../../../../src/application/config/api.config';
import { GenericException } from '../../../../../src/application/exception/genericException.entity';
import { getAllBranchesByRepositoryName } from '../../../../../src/upstream/repository/service/branch.service';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Branch Service', () => {
  test('should return non-empty array when called', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockResolvedValueOnce({
        data: [{
          name: 'b1',
          commit: {
            sha: '15610ccc7244c6a289944d1f4e39635371248f00'
          }
        }, {
          name: 'b2',
          commit: {
            sha: 'b2656fd21bbdfa67872d6b521d7dba083e0474a3'
          }
        }],
      });

    const data = await getAllBranchesByRepositoryName('b', 'u');

    expect(data.length).toEqual(2);
  });

  test('should throw GenericException when request fails with unknown error', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new Error(); });

      expect(getAllBranchesByRepositoryName('b', 'u')).rejects.toBeInstanceOf(GenericException);
  });
});