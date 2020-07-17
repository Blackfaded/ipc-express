import { IpcRenderer } from 'electron';
import { v4 as uuid } from 'uuid';

import { Method } from '../types';

interface SendData {
  method: Method;
  path: string;
  body: any;
  responseId: string;
}

export class IpcClient {
  namespace: string;
  ipcRenderer: IpcRenderer;
  methods: Method[];

  constructor(ipcRenderer: IpcRenderer, namespace = 'api-request') {
    this.ipcRenderer = ipcRenderer;
    this.namespace = namespace;
    this.methods = ['get', 'post', 'put', 'patch', 'delete'];
    this.methods.forEach((method) => {
      this[method] = this.buildRequestHandler(method);
    });
  }

  send(data: SendData) {
    this.ipcRenderer.send(this.namespace, data);
  }

  buildRequestHandler(method: Method) {
    return (path: string, body = {} as any) => {
      return new Promise((resolve, reject) => {
        const responseId = uuid();
        this.send({
          method,
          path,
          body,
          responseId,
        });

        this.ipcRenderer.on(responseId, (event, result) => {
          if (result.statusCode >= 200 && result.statusCode < 300) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    };
  }
}
