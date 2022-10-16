import axios from 'axios';

const url = 'http://localhost:8080'; // TODO export variable

export interface Response<T = any> {
  data: T;
}

export class ResponseError extends Error {
  constructor(msg: string, err?: any) {
    super(msg, err);

    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

export const get = (endpoint: string) => axios.get(`${url}${endpoint}`);

export const post = (endpoint: string, data: any) =>
  axios.post(`${url}${endpoint}`, data);
