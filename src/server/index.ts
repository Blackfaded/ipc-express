import { IpcMain } from 'electron';

import CustomResponse from './response';

export class IpcServer {
  ipcMain: IpcMain;
  listen: (expressApp: any, namespace: string) => void;
  removeAllListeners: (namespace: string) => void;
  constructor(ipcMain: IpcMain) {
    this.ipcMain = ipcMain;
    this.listen = (expressApp, namespace = 'api-request') => {
      ipcMain.on(namespace, async (originalEvent, { method, path, body, responseId }) => {
        expressApp({ method, body, url: path }, new CustomResponse(originalEvent, responseId));
      });
    };
    this.removeAllListeners = (namespace = 'api-request') => {
      this.ipcMain.removeAllListeners(namespace);
    };
  }
}
