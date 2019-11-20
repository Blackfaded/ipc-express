const CustomResponse = require('./response');

class Server {
  constructor(ipcMain) {
    this.listen = (expressApp, namespace = 'api-request') => {
      ipcMain.on(
        namespace,
        async (originalEvent, { method, path, body, responseId }) => {
          expressApp(
            { method, body, url: path },
            new CustomResponse(originalEvent, responseId)
          );
        }
      );
    };
  }
}

module.exports = Server;
