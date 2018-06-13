import * as status from 'http-status';
import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put } from 'routing-controllers';
import { KvPairAlreadyExistsError } from './../errors/KvPairAlreadyExistsError';
import { KvPairNotFoundError } from './../errors/KvPairNotFoundError';
import { KvPair, KvPairModel } from './../models/KvPairModel';

/**
 * @swagger
 * definitions:
 *   KeyValuePair:
 *     type: object
 *     required:
 *       - key
 *       - value
 *     properties:
 *       key:
 *         type: string
 *         example: foo
 *       value:
 *         oneOf:
 *         - type: string
 *         - type: number
 *         - type: integer
 *         - type: boolean
 *         - type: array
 *         - type: object
 *         example: bar
 *         description: 'Can be any type: string, number, array, object, etc.'
 */
@JsonController('/kvpair')
export class KvPairController {
  /**
   * @swagger
   * /{key}:
   *   get:
   *     description: Get a key value pair by key
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: key
   *         in: path
   *         description: Key of key value pair to return
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: Key value pair not found
   */
  @Get('/:key')
  async getByKey(@Param('key') key: string) {
    const kvPairModel = await KvPairModel.findOne({ key });
    if (!kvPairModel) {
      throw new KvPairNotFoundError(key);
    }
    return kvPairModel.toJSON();
  }

  /**
   * @swagger
   * /:
   *   post:
   *     description: Add a new key value pair
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         description: Key value pair object that needs to be added to database
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/KeyValuePair'
   *     responses:
   *       201:
   *         description: Created
   *       409:
   *         description: Conflict
   */
  @Post()
  @HttpCode(status.CREATED)
  async create(@Body() { key, value }: KvPair) {
    const kvPairModel = await KvPairModel.findOne({ key });
    if (kvPairModel) {
      throw new KvPairAlreadyExistsError(key);
    }
    const newKvPairModel = new KvPairModel({ key, value });
    await newKvPairModel.save();
    return newKvPairModel.toJSON();
  }

  /**
   * @swagger
   * /:
   *   put:
   *     description: Update an existing key value pair
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         description: Key value pair object that needs to be updated
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/KeyValuePair'
   *     responses:
   *       200:
   *         description: Update succeeded
   *       404:
   *         description: Key value pair not found
   */
  @Put()
  async update(@Body() { key, value }: KvPair) {
    const kvPairModel = await KvPairModel.findOneAndUpdate({ key }, { $set: { value } }, { new: true });
    if (!kvPairModel) {
      throw new KvPairNotFoundError(key);
    }
    return kvPairModel.toJSON();
  }

  /**
   * @swagger
   * /{key}:
   *   delete:
   *     description: Delete an existing key value pair by Key.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: key
   *         in: path
   *         description: Key of key value pair to delete
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Delete succeeded
   *       404:
   *         description: Key value pair not found
   */
  @Delete('/:key')
  @OnUndefined(status.NO_CONTENT)
  async remove(@Param('key') key: string) {
    const kvPairModel = await KvPairModel.findOneAndRemove({ key });
    if (!kvPairModel) {
      throw new KvPairNotFoundError(key);
    }
  }
}
