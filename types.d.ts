declare module IpcExpress {
  class IpcClient {
    constructor(ipcRenderer: any);
    get: (path: string, body: any) => Promise<any>;
    post: (path: string, body: any) => Promise<any>;
    put: (path: string, body: any) => Promise<any>;
    patch: (path: string, body: any) => Promise<any>;
    delete: (path: string, body: any) => Promise<any>;
  }

  class IpcServer {
    constructor(ipcMain: any);

    listen(expressApp: any): void;
  }
}

declare module 'ipc-express' {
  export = IpcExpress;
}
