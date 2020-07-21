import { IpcMain } from 'electron';

import CustomResponse from './response';

export class IpcServer {
  ipcMain: IpcMain;
  namespace: string;
  listen: (expressApp: any, namespace?: string) => void;
  removeAllListeners: () => void;
  constructor(ipcMain: IpcMain) {
    this.ipcMain = ipcMain;
    this.listen = (expressApp, namespace = 'api-request') => {
      this.namespace = namespace;
      ipcMain.on(this.namespace, async (originalEvent, { method, path, body, responseId }) => {
        expressApp({ method, body, url: path }, new CustomResponse(originalEvent, responseId));
      });
    };
    this.removeAllListeners = () => {
      this.ipcMain.removeAllListeners(this.namespace);
    };
  }
}
