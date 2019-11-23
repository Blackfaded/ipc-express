import { Response } from './response';
export class IpcServer {
  listen: (expressApp: any) => void;
  private ipcMain: any;
  constructor(ipcMain: any) {
    this.ipcMain = ipcMain;
    this.listen = expressApp => {
      this.ipcMain.on(
        'api-request',
        async (originalEvent, { method, path, body, responseId }) => {
          expressApp(
            { method, body, url: path },
            new Response(originalEvent, responseId)
          );
        }
      );
    };
  }
}
