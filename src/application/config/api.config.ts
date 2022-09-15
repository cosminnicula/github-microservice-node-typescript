import axios, { AxiosInstance } from 'axios';
import { UnauthorizedException } from '../exception/unauthorizedException.entity';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: `${process.env.GITHUB_BASE_URL || 'https://api.github.com'}`
});

if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  axiosClient.defaults.headers.common['Authorization'] = `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`;
}

export default axiosClient;
