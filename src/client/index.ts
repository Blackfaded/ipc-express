import { IpcRenderer } from 'electron';

import { DEFAULT_NAMESPACE } from '../constant';
import { IpcPort, Method, Methods, Response } from '../type';
import { uniqueId } from '../util';
import RequestData from './request';

type IClient = {
  [key in typeof Methods[number]]: <Data = any>(
    url: string,
    body?: any
  ) => Promise<Response<Data>>;
};

export class IpcClient implements IClient {
  namespace: string;
  ipcPort: IpcPort | IpcRenderer;
  constructor(ipcPort: IpcPort | IpcRenderer, namespace = DEFAULT_NAMESPACE) {
    this.ipcPort = ipcPort;
    this.namespace = namespace;
  }

  private send = (data: RequestData) => this.ipcPort.send(this.namespace, data);

  request = <Data = any>(method: Method, url: string, body?: any) =>
    new Promise<Response<Data>>((resolve, reject) => {
      const responseId = uniqueId();

      this.ipcPort.once(responseId, (_: any, result: any) => {
        if (result.statusCode >= 200 && result.statusCode < 300) {
          resolve(result);
        } else {
          reject(result);
        }
      });

      this.send({
        method,
        url,
        body: body || {},
        responseId,
      });
    });

  post = <Data = any>(url: string, body?: any) =>
    this.request<Data>('post', url, body);

  get = <Data = any>(url: string, body?: any) =>
    this.request<Data>('get', url, body);

  put = <Data = any>(url: string, body?: any) =>
    this.request<Data>('put', url, body);

  patch = <Data = any>(url: string, body?: any) =>
    this.request<Data>('patch', url, body);

  delete = <Data = any>(url: string, body?: any) =>
    this.request<Data>('delete', url, body);
}
