import * as uuid from 'uuid/v4';

export class IpcClient {
  private ipcRenderer: any;
  private methods: string[];

  constructor(ipcRenderer: any) {
    this.ipcRenderer = ipcRenderer;
    this.methods = ['get', 'post', 'put', 'patch', 'delete'];
    this.methods.forEach(method => {
      this[method] = this.buildRequestHandler(method);
    });
  }

  buildRequestHandler(method: string) {
    return (path: string, body = {} as any) => {
      return new Promise((resolve, reject) => {
        const responseId = uuid();
        this.ipcRenderer.send('api-request', {
          method,
          path,
          body,
          responseId
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
