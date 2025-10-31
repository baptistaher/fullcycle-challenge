import axios, { type AxiosInstance, type AxiosPromise } from 'axios';

export class ApiService {
  private _api: AxiosInstance;

  constructor() {
    this._api = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  //Get method
  get<T>(endpoint: string, config = {}): AxiosPromise<T> {
    return this._api.get<T>(endpoint, config);
  }

  //Post method
  post<T>(endpoint: string, data: unknown, config = {}): AxiosPromise<T> {
    return this._api.post<T>(endpoint, data, config);
  }

  getApiInstance(): AxiosInstance {
    return this._api;
  }
}
