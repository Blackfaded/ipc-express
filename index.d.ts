import { IpcMain, IpcRenderer } from 'electron';

declare module 'ipc-express' {
  export class IpcClient {
    constructor(ipcRenderer: IpcRenderer);
    get: (path: string, body: any) => Promise<any>;
    post: (path: string, body: any) => Promise<any>;
    put: (path: string, body: any) => Promise<any>;
    patch: (path: string, body: any) => Promise<any>;
    delete: (path: string, body: any) => Promise<any>;
  }

  export class IpcServer {
    constructor(ipcMain: IpcMain);

    listen(expressApp: any, namespace?: string): void;
    removeAllListeners(namespace?: string): void;
  }
}
