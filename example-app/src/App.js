import React, { Component } from 'react';
import { IpcClient } from 'ipc-express';
const { ipcRenderer } = window.require('electron');

const ipc = new IpcClient(ipcRenderer);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null
    };
  }

  async componentDidMount() {
    const testId = 5;
    const { data } = await ipc.get(`/test/${testId}`);
    this.setState({
      response: data
    });
  }

  render() {
    return (
      <div>
        {this.state.response && <div>Received id {this.state.response}</div>}
      </div>
    );
  }
}

export default App;
