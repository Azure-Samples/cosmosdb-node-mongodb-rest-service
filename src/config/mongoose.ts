import { logger } from 'config/winston';
import * as mongoose from 'mongoose';
import { ConnectionOptions } from 'mongoose';
import * as parse from 'url-parse';
import { configs } from './environment';

const options: ConnectionOptions = { keepAlive: true };

export async function connectDb(connectionString: string) {
  // URL encodes the password for a Cosmos DB connection string
  // Needed because mongodb driver 3.0 and above requires passwords to be encoded
  const parsedURL = parse(connectionString);
  if (parsedURL.password) {
    // Decode before encode is used to maintain compatibility with previously
    // encoded passwords
    parsedURL.set('password', encodeURIComponent(decodeURIComponent(parsedURL.password)));
  }
  connectionString = parsedURL.href;

  const connect = async () =>
    await mongoose.connect(
      connectionString,
      options
    );

  mongoose.set('debug', configs.mode === 'development');
  mongoose.connection.on('connecting', () => logger.info('Connecting to MongoDb...'));
  mongoose.connection.on('open', () => logger.info('Connection to MongoDb opened'));
  mongoose.connection.on('connected', () => logger.info('Connected to MongoDb'));
  mongoose.connection.on('reconnected', () => logger.info('Reconnected to MongoDb'));
  mongoose.connection.on('disconnected', () => logger.error('Disconnected from MongoDb'));

  mongoose.connection.on('error', err => {
    logger.error(`MongoDb Error ${err}`);
    mongoose.disconnect();
  });

  try {
    await connect();
  } catch (err) {
    logger.error(`MongoDb first connection attempt failed ${err}`);
  }
}
