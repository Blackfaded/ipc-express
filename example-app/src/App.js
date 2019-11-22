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
    const { data } = await ipc.get(`/test/${testId}?test=testquery`);
    const { params, query } = data;
    this.setState({
      response: { params, query }
    });
  }

  renderResponse = data => {
    return (
      <>
        <div>
          <span>Params: </span>
          <span> {JSON.stringify(data.params)}</span>
        </div>
        <div>
          <span>Queries: </span>
          <span> {JSON.stringify(data.query)}</span>
        </div>
      </>
    );
  };

  render() {
    return (
      <div>
        {this.state.response && this.renderResponse(this.state.response)}
      </div>
    );
  }
}

export default App;
