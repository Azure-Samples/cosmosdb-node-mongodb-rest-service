import { Model, Query } from 'mongoose';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { assert, createSandbox, SinonSandbox, SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { KvPairModel } from '../../../src/models/KvPairModel';
import { KvPairController } from './../../../src/controllers/KvPairController';
import { KvPairNotFoundError } from './../../../src/errors/KvPairNotFoundError';

describe('KvPairController', () => {
  const controller = new KvPairController();
  const sandbox = createSandbox();

  const existingKvPair = { key: 'existingKey', value: 'existingVal' };
  const nonExistingKvPair = { key: 'nonExistingKey', value: 'nonExistingVal' };

  const baseUrl = '/kvpair';
  const existingKeyUrl = `${baseUrl}/${existingKvPair.key}`;
  const nonExistingKeyUrl = `${baseUrl}/${nonExistingKvPair.key}`;

  const findOneStub = stub(KvPairModel, 'findOne');
  findOneStub.withArgs({ key: existingKvPair.key }).resolves(new KvPairModel(existingKvPair));
  findOneStub.withArgs({ key: nonExistingKvPair.key }).resolves(null);

  afterEach(() => sandbox.restore());

  afterAll(() => findOneStub.restore());

  describe('getByKey', () => {
    it('should throw KvPairNotFoundError with non-existing key', async () => {
      expect.assertions(1);
      await expect(controller.getByKey(nonExistingKvPair.key)).rejects.toThrow(
        `Key value pair with key='${nonExistingKvPair.key}' does not exist.`
      );
    });

    it('should return the key value pair if it exists', async () => {
      expect.assertions(2);
      const result = await controller.getByKey(existingKvPair.key);
      expect(result).toHaveProperty('_id');
      expect(result).toMatchObject(existingKvPair);
    });
  });

  describe('create', () => {
    it('should throw KvPairAlreadyExistsError with existing key', async () => {
      expect.assertions(1);
      await expect(controller.create(existingKvPair)).rejects.toThrow(
        `Key value pair with key='${existingKvPair.key}' already exists.`
      );
    });

    it('should save and return the key value pair a new key value pair is provided', async () => {
      expect.assertions(2);
      const saveMock = sandbox.stub(KvPairModel.prototype, 'save').resolves(); // A hack to mock 'save'
      const result = await controller.create(nonExistingKvPair);
      expect(result).toHaveProperty('_id');
      expect(result).toMatchObject(nonExistingKvPair);
      assert.calledOnce(saveMock);
    });
  });

  describe('update', () => {
    it('should throw KvPairNotFoundError with non-exsiting key', async () => {
      expect.assertions(1);
      sandbox.stub(KvPairModel, 'findOneAndUpdate').resolves(null);
      await expect(controller.update(nonExistingKvPair)).rejects.toThrow(
        `Key value pair with key='${nonExistingKvPair.key}' does not exist.`
      );
    });

    it('should update and return the key value pair if it exists', async () => {
      expect.assertions(1);
      sandbox.stub(KvPairModel, 'findOneAndUpdate').resolves(new KvPairModel(existingKvPair));
      const result = await controller.update(existingKvPair);
      expect(result).toMatchObject(existingKvPair);
    });
  });

  describe('remove', () => {
    it('should throw KvPairNotFoundError with non-exsiting key', async () => {
      expect.assertions(1);
      sandbox.stub(KvPairModel, 'findOneAndRemove').resolves(null);
      await expect(controller.remove(nonExistingKvPair.key)).rejects.toThrow(
        `Key value pair with key='${nonExistingKvPair.key}' does not exist.`
      );
    });

    it('should not throw if the key exists', async () => {
      expect.assertions(1);
      sandbox.stub(KvPairModel, 'findOneAndRemove').resolves(new KvPairModel(existingKvPair));
      await expect(controller.remove(existingKvPair.key)).resolves.not.toThrow();
    });
  });
});
