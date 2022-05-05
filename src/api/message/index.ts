import { Router } from 'express';

import { validate } from '../../services/validation';
import { protect } from '../../services/access';
import {
  validateCreateMessage,
  validateListMessage,
  validateReadMessage,
} from '../../constants/messages';
import create from './create';
import list from './list';
import read from './read';

const router = Router();

/**
 * @swagger
 * /api/v1/messages/{chat}:
 *  post:
 *      summary: Send message
 *      security:
 *          - BearerAuth: []
 *      description: Send message
 *      tags: ["Message"]
 *      parameters:
 *          - in: path
 *            name: chat
 *            schema:
 *                type: string
 *            required: true
 *            description: The chat id
 *      requestBody:
 *          description: send message attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreateMessage'
 *              example:
 *                {
 *                 "text": "some-message-text"
 *                }
 *      responses:
 *          201:
 *              description: Successfully created message
 *              content:
 *                  application/json:
 *                      example:
 *                       {
 *                            readBy: [],
 *                            _id: 'message-id',
 *                            author: 'author-id',
 *                            text: 'create-message-text',
 *                            chat: 'chat-id',
 *                            createdAt: 'date',
 *                            updatedAt: 'date'
 *                       }
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.post('/:chat', protect, validate(validateCreateMessage), create);

/**
 * @swagger
 * /api/v1/messages/{chat}:
 *  get:
 *      summary: Get messages
 *      security:
 *          - BearerAuth: []
 *      description: Get messages
 *      tags: ["Message"]
 *      parameters:
 *          - in: path
 *            name: chat
 *            schema:
 *                type: string
 *            required: true
 *            description: The chat id
 *          - in: query
 *            name: date
 *            schema:
 *                type: string
 *            description: message start date
 *          - in: query
 *            name: operator
 *            schema:
 *                type: string
 *                enum:
 *                  - "-"
 *                  - +
 *            description: handle date operator ('-' - lower than; '+' - greater than); Default operator is '+'
 *      responses:
 *          200:
 *              description: Successfully got list of messages
 *              content:
 *                  application/json:
 *                      example:
 *                        {
 *                          "firstUnreadMessage": {
 *                            "readBy": [],
 *                            "_id": "message-id",
 *                            "author": "author-id",
 *                            "text": some-text",
 *                            "chat": "chat-id",
 *                            "createdAt": "date",
 *                            "updatedAt": "date"
 *                          },
 *                          "messages": {
 *                            "YYYY.MM.DD": [
 *                              {
 *                                "_id": "message-id",
 *                                "readBy": [],
 *                                "author": "author-id",
 *                                "text": "text",
 *                                "chat": "chat-id",
 *                                "createdAt": "date",
 *                                "updatedAt": "date"
 *                              }
 *                            ]
 *                          }
 *                        }
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.get('/:chat', protect, validate(validateListMessage), list);

/**
 * @swagger
 * /api/v1/messages/{id}:
 *  patch:
 *      summary: Read message
 *      security:
 *          - BearerAuth: []
 *      description: Read message by id
 *      tags: ["Message"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: The message id
 *      responses:
 *          200:
 *              description: Successfully read message
 *              content:
 *                  application/json:
 *                      example:
 *                       {
 *                       }
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.patch('/:id', protect, validate(validateReadMessage), read);

export default router;
