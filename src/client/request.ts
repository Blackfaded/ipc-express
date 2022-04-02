import { Method } from '../type';

export default interface RequestData {
  method: Method;
  url: string;
  body?: any;
  responseId: string;
}
