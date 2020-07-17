import express from 'express';

import { IpcClient } from '../client';
import { IpcServer } from '../server';

import { ipcRenderer, ipcMain } from './mock/electron-mock';

describe('ipc-express', () => {
  let ipcC;
  let ipcS;
  let expressApp;
  beforeEach(() => {
    const cloneIpcRenderer = Object.assign(Object.create(Object.getPrototypeOf(ipcRenderer)), ipcRenderer);
    const cloneipcMain = Object.assign(Object.create(Object.getPrototypeOf(ipcMain)), ipcMain);

    expressApp = express();
    ipcC = new IpcClient(cloneIpcRenderer);
    ipcS = new IpcServer(cloneipcMain);

    ipcS.listen(expressApp, 'api-request');
  });

  afterEach(() => {
    ipcS.removeAllListeners('api-request');
  });

  describe('Params', () => {
    beforeEach(() => {
      expressApp.use('/test/:id', (req, res) => {
        res.send({
          params: req.params,
        });
      });
    });
    it('shows an initial window', async () => {
      const { data } = await ipcC.get('/test/testID');
      expect(data.params.id).toEqual('testID');
    });
  });

  describe('Query', () => {
    beforeEach(() => {
      console.log('executed');
      expressApp.use('/test', (req, res) => {
        res.send({
          query: req.query,
        });
      });
      console.log('executed2');
    });
    it('shows an initial window', async () => {
      const { data } = await ipcC.get('/test?testquery=test');
      expect(data.query).toEqual({
        testquery: 'test',
      });
    });
  });

  describe('given long calculating response', () => {
    beforeEach(() => {
      expressApp.use('/test', (_, res) => {
        setTimeout(() => {
          res.send({
            long: true,
          });
        }, 5000);
      });
    });
    it('shows an initial window', async () => {
      const { data } = await ipcC.get('/test');
      expect(data.long).toEqual(true);
    }, 10000);
  });
});
