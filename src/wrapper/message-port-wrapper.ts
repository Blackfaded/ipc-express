import { DEFAULT_NAMESPACE } from '../constant';
import { IpcPort, IpcPortEvent } from '../type';

export default class MessagePortWrapper implements IpcPort {
  private messagePort: MessagePort;
  namespace: string = DEFAULT_NAMESPACE;

  private invokeHandlers: Map<
    string,
    (e: IpcPortEvent, ...args: any[]) => void
  > = new Map();

  constructor(messagePort: MessagePort) {
    this.messagePort = messagePort;
    this.messagePort.onmessage = this.onMessage;
  }

  private onMessage = (e: MessageEvent) => {
    const { data } = e;
    const { responseId, namespace } = data;

    const handler =
      this.invokeHandlers.get(responseId) || this.invokeHandlers.get(namespace);

    if (!handler) return;

    const event: IpcPortEvent = {
      sender: {
        send: (channel: string, data: any) => {
          this.messagePort.postMessage({
            ...data,
            namespace,
            responseId: channel,
          });
        },
      },
    };
    handler(event, data);
  };

  send = (responseId: string, data: any): void => {
    this.messagePort.postMessage({
      responseId,
      ...data,
      namespace: this.namespace,
    });
  };

  on = (
    channel: string,
    listener: (event: IpcPortEvent, data: any) => void
  ): void => {
    if (this.invokeHandlers.has(channel)) {
      throw new Error(
        `Attempted to register a second handler for '${channel}'`
      );
    }
    this.invokeHandlers.set(channel, listener);
  };

  once = (
    channel: string,
    listener: (event: IpcPortEvent, data: any) => void
  ): void => {
    this.on(channel, (e, data) => {
      this.removeAllListeners(channel);
      listener(e, data);
    });
  };

  removeAllListeners = (channel?: string): void => {
    if (channel) this.invokeHandlers.delete(channel);
    else this.invokeHandlers.clear();
  };
}
