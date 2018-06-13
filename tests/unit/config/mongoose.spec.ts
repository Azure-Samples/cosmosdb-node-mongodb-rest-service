import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { assert, spy } from 'sinon';
import { connectDb } from '../../../src/config/mongoose';
import { logger } from '../../../src/config/winston';

dotenv.config();

describe('Database Testing', () => {
  logger.info('Starting database testing');

  let dbConnection: string;
  dbConnection = process.env.DB_CONN_STRING;
  logger.info('The connection string is: ' + dbConnection);

  afterEach(() => {
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }
  });

  afterAll(() => {
    logger.info('Finished database testing');
  });

  it('should return error when given a bad connection string', async () => {
    const mySpy = spy(logger, 'error');
    const badString = 'mongodb://badstring:27017/configdb';
    await connectDb(badString);
    assert.called(mySpy);
    mySpy.restore();
  });

  it('should connect to the global database', async () => {
    await connectDb(dbConnection);
    assert.match(mongoose.connection.readyState, 1);
    mongoose.connection.close();
    assert.match(mongoose.connection.readyState, 0);
  });

  it('should be able to disconnect from global database', async () => {
    await connectDb(dbConnection);
    assert.match(mongoose.connection.readyState, 1);
    mongoose.connection.close();
    assert.match(mongoose.connection.readyState, 0);
  });
});
