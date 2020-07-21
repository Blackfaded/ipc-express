import { IpcMain, IpcRenderer } from 'electron';

declare module 'ipc-express' {
  export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

  export class IpcClient {
    namespace: string;
    ipcRenderer: IpcRenderer;
    methods: Method[];
    constructor(ipcRenderer: IpcRenderer);
    get: (path: string, body: any) => Promise<any>;
    post: (path: string, body: any) => Promise<any>;
    put: (path: string, body: any) => Promise<any>;
    patch: (path: string, body: any) => Promise<any>;
    delete: (path: string, body: any) => Promise<any>;
  }

  export class IpcServer {
    ipcMain: IpcMain;
    namespace: string;
    listen(expressApp: any, namespace?: string): void;
    removeAllListeners(): void;
    constructor(ipcMain: IpcMain);
  }
}
