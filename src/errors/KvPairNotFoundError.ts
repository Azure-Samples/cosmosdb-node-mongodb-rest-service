import * as status from 'http-status';
import { HttpError } from 'routing-controllers';

export class KvPairNotFoundError extends HttpError {
  constructor(key: string) {
    super(status.NOT_FOUND, `Key value pair with key='${key}' does not exist.`);
  }
}
