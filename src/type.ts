export const Methods = ['get', 'post', 'put', 'patch', 'delete'] as const;
export type Method = typeof Methods[number];

export interface IpcPortEvent {
  sender: {
    send: (channel: string, data: any) => void;
  };
}

export interface IpcPort {
  send(channel: string, data: any, namespace?: string): void;
  on(channel: string, listener: (event: IpcPortEvent, data: any) => void): void;
  once(
    channel: string,
    listener: (event: IpcPortEvent, data: any) => void
  ): void;
  removeAllListeners(channel?: string): void;
}

export interface Response<Data = any> {
  data: Data;
  statusCode: number;
}
