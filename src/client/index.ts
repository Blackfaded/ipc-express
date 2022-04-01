import { IpcRenderer } from 'electron';
import { DEFAULT_NAMESPACE } from '../constant';

import { IpcPort, Method, Methods } from '../type';
import { uniqueId } from '../util';
import RequestData from './request';

type IClient = {
  [key in typeof Methods[number]]: <Request = any | undefined, Response = any>(
    url: string,
    body?: Request
  ) => Promise<Response>;
};

export class IpcClient implements IClient {
  namespace: string;
  ipcPort: IpcPort | IpcRenderer;
  constructor(ipcPort: IpcPort | IpcRenderer, namespace = DEFAULT_NAMESPACE) {
    this.ipcPort = ipcPort;
    this.namespace = namespace;
  }

  private send = (data: RequestData) => this.ipcPort.send(this.namespace, data);

  request = <Request = any | undefined, Response = any>(
    method: Method,
    url: string,
    body?: Request
  ) =>
    new Promise<Response>((resolve, reject) => {
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

  post = <Request = any | undefined, Response = any>(
    url: string,
    body?: Request
  ) => this.request<Request, Response>('post', url, body);

  get = <Request = any | undefined, Response = any>(
    url: string,
    body?: Request
  ) => this.request<Request, Response>('get', url, body);

  put = <Request = any | undefined, Response = any>(
    url: string,
    body?: Request
  ) => this.request<Request, Response>('put', url, body);

  patch = <Request = any | undefined, Response = any>(
    url: string,
    body?: Request
  ) => this.request<Request, Response>('patch', url, body);

  delete = <Request = any | undefined, Response = any>(
    url: string,
    body?: Request
  ) => this.request<Request, Response>('delete', url, body);
}
