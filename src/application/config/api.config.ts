import axios, { AxiosInstance } from 'axios';
import { StatusCodes } from 'http-status-codes'

import { UnauthorizedException } from '../exception/unauthorizedException.entity';

const axiosClient: AxiosInstance = axios.create({
  baseURL: `${process.env.GITHUB_BASE_URL || 'https://api.github.com'}`
});

axiosClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === StatusCodes.UNAUTHORIZED) {
      return Promise.reject(new UnauthorizedException('Not authorized'));
    }

    return Promise.reject(err);
  }
)

if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  axiosClient.defaults.headers.common['Authorization'] = `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`;
}

export default axiosClient;
