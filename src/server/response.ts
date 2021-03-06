import { IResponseObject } from '../interfaces';

export default class Response {
  private originalEvent: any;
  private responseId: string;
  private statusCode: number;
  setHeader: () => void;
  send: (result) => void;
  private getResponseObject: (result) => IResponseObject;
  private status: (code: number) => this;

  constructor(originalEvent, responseId: string) {
    this.originalEvent = originalEvent;
    this.responseId = responseId;
    this.statusCode = 200;

    this.setHeader = () => this;

    this.send = (result) => {
      this.originalEvent.sender.send(this.responseId, this.getResponseObject(result));
    };

    this.getResponseObject = (result) => ({
      data: result,
      statusCode: this.statusCode,
    });

    this.status = (code: number) => {
      this.statusCode = code;
      return this;
    };

    return this;
  }
}
