import { Response } from './response';

export class IpcServer {
  listen: (expressApp: any, namespace: string) => any;
  constructor(ipcMain) {
    this.listen = (expressApp, namespace = 'api-request') => {
      ipcMain.on(
        namespace,
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
