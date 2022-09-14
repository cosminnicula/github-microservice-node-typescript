import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: `${process.env.GITHUB_BASE_URL}`
});

axiosClient.defaults.headers.common['Authorization'] = `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`;

export default axiosClient;
