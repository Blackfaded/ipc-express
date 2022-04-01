import { IpcPortEvent } from '../type';

export default class Response {
  private originalEvent: IpcPortEvent;
  private responseId: string;
  private namespace: string;
  private statusCode: number;

  constructor(originalEvent: any, namespace: string, responseId: string) {
    this.originalEvent = originalEvent;
    this.namespace = namespace;
    this.responseId = responseId;
    this.statusCode = 200;
  }

  private getResponseObject = (result: any) => ({
    namespace: this.namespace,
    data: result,
    statusCode: this.statusCode,
  });

  setHeader = () => this;
  send = (result: any) => {
    this.originalEvent.sender.send(
      this.responseId,
      this.getResponseObject(result)
    );
  };
}
