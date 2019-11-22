const { Application } = require('spectron');
const path = require('path');

let electronPath = path.join(
  __dirname,
  'example-app',
  'node_modules',
  '.bin',
  'electron'
);
const appPath = path.join(__dirname, 'example-app');
let app;

beforeEach(function() {
  app = new Application({
    // Your electron path can be any binary
    // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
    // But for the sake of the example we fetch it from our node_modules.
    path: electronPath,

    // Assuming you have the following directory structure

    //  |__ my project
    //     |__ ...
    //     |__ main.js
    //     |__ package.json
    //     |__ index.html
    //     |__ ...
    //     |__ test
    //        |__ spec.js  <- You are here! ~ Well you should be.

    // The following line tells spectron to look and use the main.js file
    // and the package.json located 1 level above.
    args: [appPath]
  });
  return app.start();
});

afterEach(function() {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

describe('Test Example', () => {
  it('shows an initial window', function() {
    return app.client.getWindowCount().then(function(count) {
      expect(count).toEqual(1);
    });
  });
});
