import * as uuid from 'uuid/v4';

export class IpcClient {
  namespace: string;
  ipcRenderer: any;
  methods: string[];

  constructor(ipcRenderer, namespace = 'api-request') {
    this.ipcRenderer = ipcRenderer;
    this.namespace = namespace;
    this.methods = ['get', 'post', 'put', 'patch', 'delete'];
    this.methods.forEach(method => {
      this[method] = this.buildRequestHandler(method);
    });
  }

  buildRequestHandler(method: string) {
    return (path: string, body = {} as any) => {
      return new Promise((resolve, reject) => {
        const responseId = uuid();
        this.ipcRenderer.send(this.namespace, {
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
