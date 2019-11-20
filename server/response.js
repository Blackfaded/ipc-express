module.exports = class Response {
  constructor(originalEvent, responseId) {
    this.originalEvent = originalEvent;
    this.responseId = responseId;
    this.statusCode = 200;
    this.setHeader = () => {};
    this.send = result => {
      this.originalEvent.sender.send(
        this.responseId,
        this.getResponseObject(result)
      );
    };
    this.getResponseObject = result => {
      if (this.statusCode >= 200 && this.statusCode < 300) {
        return {
          data: result,
          statusCode: this.statusCode
        };
      } else {
        return {
          data: result,
          statusCode: this.statusCode
        };
      }
    };
    this.status = code => {
      this.statusCode = code;
      return this;
    };
    return this;
  }
};