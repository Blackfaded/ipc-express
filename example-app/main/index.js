const { BrowserWindow, ipcMain, app } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
let mainWindow;

const express = require('express');
const { IpcServer } = require('ipc-express');
const routes = require('./routes');

const expressApp = express();
const ipc = new IpcServer(ipcMain);

const someMiddleware = (req, res, next) => {
  console.log('middleware executed');
  next();
};
expressApp.use(someMiddleware);
expressApp.use(routes);

ipc.listen(expressApp, 'api-request');

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => (mainWindow = null));
};
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
