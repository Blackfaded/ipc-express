import createIPCMock from 'electron-mock-ipc';
import express, { Express } from 'express';
import { MessageChannelPolyfill } from 'message-port-polyfill';
import { IpcClient } from '../src/client';
import { IpcServer } from '../src/server';
import MessagePortWrapper from '../src/wrapper/message-port-wrapper';

describe('Common', () => {
  let expressApp: Express;
  let ipcClient: IpcClient;
  let ipcServer: IpcServer;
  beforeEach(() => {
    const mocked = createIPCMock();
    const ipcMain = mocked.ipcMain;
    const ipcRenderer = mocked.ipcRenderer;

    expressApp = express();
    ipcClient = new IpcClient(ipcRenderer);
    ipcServer = new IpcServer(ipcMain);

    ipcServer.listen(expressApp);
  });

  afterEach(() => {
    ipcServer?.removeAllListeners();
  });

  describe('Params', () => {
    beforeEach(() => {
      expressApp.use('/test/:id', (req, res) => {
        res.send({
          params: req.params,
        });
      });
    });

    it('should get params', async () => {
      const { data } = await ipcClient.get('/test/testID');
      expect(data.params.id).toEqual('testID');
    });
  });

  describe('Query', () => {
    beforeEach(() => {
      expressApp.use('/test', (req, res) => {
        res.send({
          query: req.query,
        });
      });
    });
    it('should return send query', async () => {
      const { data } = await ipcClient.get('/test?testquery=test');
      expect(data.query).toEqual({
        testquery: 'test',
      });
    });
  });

  describe('Given long calculating response', () => {
    beforeEach(() => {
      expressApp.use('/test', (_, res) => {
        setTimeout(() => {
          res.send({
            long: true,
          });
        }, 5000);
      });
    });
    it('should return send data even with long computation', async () => {
      const { data } = await ipcClient.get('/test');
      expect(data.long).toEqual(true);
    }, 10000);
  });
});

describe('MessageChannelMain', () => {
  let expressApp: Express;
  let ipcClient1: IpcClient;
  let ipcServer1: IpcServer;
  let ipcClient2: IpcClient;
  let ipcServer2: IpcServer;

  afterEach(() => {
    ipcServer1?.removeAllListeners();
    ipcServer2?.removeAllListeners();
  });

  describe('Params', () => {
    beforeEach(() => {
      const { port1, port2 } = new MessageChannelPolyfill();

      expressApp = express();
      ipcClient1 = new IpcClient(new MessagePortWrapper(port2));
      ipcServer1 = new IpcServer(new MessagePortWrapper(port1));

      ipcServer1.listen(expressApp);

      expressApp.use('/test/:id', (req, res) => {
        res.send({
          params: req.params,
        });
      });
    });

    it('should get params', async () => {
      const { data } = await ipcClient1.get('/test/testID');
      expect(data.params.id).toEqual('testID');
    });
  });

  describe('Bidirectional connection', () => {
    beforeEach(() => {
      const { port1, port2 } = new MessageChannelPolyfill();

      expressApp = express();
      const messagePortWrapper1 = new MessagePortWrapper(port1);
      const messagePortWrapper2 = new MessagePortWrapper(port2);

      ipcClient1 = new IpcClient(messagePortWrapper1);
      ipcServer1 = new IpcServer(messagePortWrapper2);

      ipcServer1.listen(expressApp);

      ipcClient2 = new IpcClient(messagePortWrapper2);
      ipcServer2 = new IpcServer(messagePortWrapper1);

      ipcServer2.listen(expressApp);

      expressApp.use('/test/:id', (req, res) => {
        res.send({
          params: req.params,
        });
      });
    });

    it('should get params', async () => {
      const { data: data1 } = await ipcClient1.get('/test/testID');
      const { data: data2 } = await ipcClient2.get('/test/testID');

      expect(data1.params.id).toEqual(data2.params.id);
    });
  });
});
