import { IpcMain } from 'electron';
import { Express } from 'express';
import RequestData from '../client/request';
import { DEFAULT_NAMESPACE } from '../constant';
import { IpcPort } from '../type';

import Response from './response';

export class IpcServer {
  ipcPort: IpcPort | IpcMain;
  namespace: string;
  constructor(ipcPort: IpcPort | IpcMain, namespace = DEFAULT_NAMESPACE) {
    this.ipcPort = ipcPort;
    this.namespace = namespace;
  }

  listen = (expressApp: Express) => {
    this.ipcPort.on(
      this.namespace,
      (originalEvent: any, data?: RequestData) => {
        if (!data) {
          return;
        }

        expressApp(
          data as any,
          new Response(originalEvent, this.namespace, data.responseId) as any
        );
      }
    );
  };

  removeAllListeners = () => {
    return this.ipcPort.removeAllListeners(this.namespace);
  };
}
