import axios, { AxiosInstance } from 'axios';

export default class StatsClient {
  private axiosInstance: AxiosInstance

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({ baseURL: baseUrl });
  }

  async getRepositoryBranchesByUsername(username: string) {
    return this.axiosInstance.get(`/stats/repository-branches?username=${username}`);
  }
}