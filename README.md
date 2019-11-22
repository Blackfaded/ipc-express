# ipc-express for electron

This library enables you to use the express framework in the mainthread of electron but without the http overhead.

## Usage

### Installation
```bash
npm i ipc-express
```

### in your main.js file

```js
const { ipcMain } = require('electron');
const express = require('express');
const { IpcServer } = require('ipc-express');

const expressApp = express();
const ipc = new IpcServer(ipcMain);

const someMiddleware = (req, res, next) => {
  next();
};
expressApp.use(someMiddleware);

expressApp.get('/test/:id', (req, res) => {
  res.send({
    params: req.params,
    query: req.query
  });
});


ipc.listen(expressApp, 'api-request');
```

### In your frontend framework

```js
import { IpcClient } from 'ipc-express';
const { ipcRenderer } = window.require('electron');

const ipc = new IpcClient(ipcRenderer);

  async componentDidMount() {
    const testId = 5;
    const { data } = await ipc.get(`/test/${testId}?test=testquery`);
    const { params, query } = data;
    console.log({ params, query })
  }
```

### example

An example can be found in the `example-app` folder.
To start the example-app:
```bash
cd example-app
npm run start:main
npm run start:renderer
```

## contribute
* fork this repo
* `npm i` 
* make changes on new branch
* update README
* submit PR

# Todo
- [ ] extend the response object to an more express-like one

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright &copy; 2019-Present, René Heinen. All rights reserved.
