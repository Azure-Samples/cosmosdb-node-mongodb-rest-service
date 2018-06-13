import * as status from 'http-status';
import { HttpError } from 'routing-controllers';

export class KvPairAlreadyExistsError extends HttpError {
  constructor(key: string) {
    super(status.CONFLICT, `Key value pair with key='${key}' already exists.`);
  }
}
