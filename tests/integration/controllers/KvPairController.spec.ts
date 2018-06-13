import * as dotenv from 'dotenv';
import { Mockgoose } from 'mockgoose';
import { MongoBins } from 'mongodb-prebuilt';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { assert } from 'sinon';
import * as request from 'supertest';
import { connectDb } from '../../../src/config/mongoose';
import { logger } from '../../../src/config/winston';
import { KvPairModel } from '../../../src/models/KvPairModel';
import { KvPairController } from './../../../src/controllers/KvPairController';

// Loads the environment variables from the .env file
dotenv.config();

describe('KvPairController:integration', async () => {
  const mockgoose = new Mockgoose(mongoose);
  mockgoose.helper.setDbVersion('3.4.3');
  const app = createExpressServer({
    development: false,
    classTransformer: false,
    controllers: [KvPairController]
  });

  const existingConfig = { key: 'existingKey', value: 'existingVal' };
  const nonExistingConfig = { key: 'nonExistingKey', value: 'nonExistingVal' };
  const errorConfig = { key: 'throwError', value: 'errorThrown' };

  const baseUrl = '/kvpair';
  const existingKeyUrl = `${baseUrl}/${existingConfig.key}`;
  const nonExistingKeyUrl = `${baseUrl}/${nonExistingConfig.key}`;
  const errorKeyUrl = `${baseUrl}/${errorConfig.key}`;

  logger.info('DB_CONN_STRING: ' + process.env.DB_CONN_STRING);

  beforeAll(async () => {
    if (process.env.DB_CONN_STRING.includes('localhost')) {
      logger.info('Using mockgoose');
      jest.setTimeout(30000);
      const mockConnection = await mockgoose.prepareStorage();
    }
    connectDb(process.env.DB_CONN_STRING);
  });

  afterAll(() => {
    if (process.env.DB_CONN_STRING.includes('localhost')) {
      new MongoBins('mongo', ['--eval', "db.getSiblingDB('admin').shutdownServer()"]).run();
    }
    mongoose.connection.close();
  });

  beforeEach(async () => {
    // Must assume that post works to get the existing config in the db
    await request(app)
      .post(baseUrl)
      .send(existingConfig);
  });

  afterEach(async () => {
    // Removes the nonExistingConfig if it was posted
    await KvPairModel.find({ key: `${nonExistingConfig.key}` }).remove();
  });

  describe('POST /', () => {
    it('should return 409 Conflict if the config key already exists', async () => {
      await request(app)
        .post(baseUrl)
        .send(existingConfig)
        .expect(409, {
          name: 'HttpError',
          message: `Key value pair with key='${existingConfig.key}' already exists.`
        });
    });

    it('should return 201 Created and save the config with non-existing key', async () => {
      await request(app)
        .post(baseUrl)
        .send(nonExistingConfig)
        .expect(201);
    });
  });

  describe('GET /key', () => {
    it('should return 404 Not Found if key does not exist', async () => {
      await request(app)
        .get(nonExistingKeyUrl)
        .expect(404, {
          name: 'HttpError',
          message: `Key value pair with key='${nonExistingConfig.key}' does not exist.`
        });
    });

    it('should return 200 OK with the existing config if the key exists', async () => {
      await request(app)
        .get(existingKeyUrl)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(hasId);

      function hasId(res: any) {
        if (!('_id' in res.body)) {
          throw new Error('missing id key');
        }
      }
    });
  });

  describe('PUT /', () => {
    it('should return 404 Not Found if key does not exist', async () => {
      await request(app)
        .put(baseUrl)
        .send(nonExistingConfig)
        .expect(404, {
          name: 'HttpError',
          message: `Key value pair with key='${nonExistingConfig.key}' does not exist.`
        });
    });

    it('should return 204 No Content and json if the key was present', async () => {
      const patchConfig = { key: existingConfig.key, value: nonExistingConfig.value };
      await request(app)
        .put(baseUrl)
        .send(patchConfig)
        .expect(200);
    });
  });

  describe('DELETE /key', () => {
    it('should return 404 Not Found if the key does not exist', async () => {
      await request(app)
        .del(nonExistingKeyUrl)
        .expect(404, {
          name: 'HttpError',
          message: `Key value pair with key='${nonExistingConfig.key}' does not exist.`
        });
    });

    it('should return 204 No Content if the pair is removed', async () => {
      await request(app)
        .del(existingKeyUrl)
        .expect(204);
    });
  });
});
