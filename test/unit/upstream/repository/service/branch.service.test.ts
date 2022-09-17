import axiosClient from '../../../../../src/application/config/api.config';
import { BranchEntity } from '../../../../../src/upstream/repository/entity/branch.entity';
import { getAllBranchesByRepositoryName } from '../../../../../src/upstream/repository/service/branch.service';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Branch Service', () => {
  test('should return non-empty array when called', async () => {
    const expectedBranchesResponse: BranchEntity[] = [{
      name: 'b1',
      commit: {
        sha: '15610ccc7244c6a289944d1f4e39635371248f00'
      }
    }, {
      name: 'b2',
      commit: {
        sha: 'b2656fd21bbdfa67872d6b521d7dba083e0474a3'
      }
    }];

    jest
      .spyOn(axiosClient, 'get')
      .mockResolvedValueOnce({
        data: expectedBranchesResponse,
      });

    const data = await getAllBranchesByRepositoryName('u', 'r');

    expect(data.length).toEqual(expectedBranchesResponse.length);
  });

  test('should throw original exception when request fails with unknown error', async () => {
    jest
      .spyOn(axiosClient, 'get')
      .mockImplementationOnce(() => { throw new Error(); });

      expect(getAllBranchesByRepositoryName('u', 'r')).rejects.toBeInstanceOf(Error);
  });
});