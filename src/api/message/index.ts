import { Router } from 'express';

import { validate } from '../../services/validation';
import { protect } from '../../services/access';
import { validateCreateMessage, validateListMessage } from '../../constants/messages';
import create from './create';
import list from './list';

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
 *            name: skip
 *            schema:
 *                type: number
 *                min: 0
 *            description: how many messages should be skipped
 *      responses:
 *          200:
 *              description: Successfully created message
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
router.get('/:chat', protect, validate(validateListMessage), list);

export default router;
