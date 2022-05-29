import { Router } from 'express';
import { validate } from '../../services/validation';
import { protect } from '../../services/access';
import start from './start';
import { validateListChat, validateStartChat } from '../../constants/chat';
import list from './list';
import unreadMessages from './unread-messages';

const router = Router();

/**
 * @swagger
 * /api/v1/chats/start:
 *  post:
 *      summary: Start to chat
 *      security:
 *          - BearerAuth: []
 *      description: Start chat
 *      tags: ["Chat"]
 *      requestBody:
 *          description: start chat attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/StartChat'
 *              example:
 *                {
 *                 "isPrivate": true,
 *                 "withUser": "user_id",
 *                }
 *      responses:
 *          200:
 *              description: Successfully started chat
 *              content:
 *                  application/json:
 *                      example:
 *                       {
 *                           "isPrivate": true,
 *                           "members": [ "6242e4df6abf9b36a9bd5ba4", "6241712667f941901dcc533f" ],
 *                           "_id": "624c00056c71316fc3377538",
 *                           "createdAt": "date",
 *                           "updatedAt": "date"
 *                       }
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.post('/start', protect, validate(validateStartChat), start);

/**
 * @swagger
 * /api/v1/chats/:
 *  get:
 *      summary: Start to chat
 *      security:
 *          - BearerAuth: []
 *      description: Start chat
 *      tags: ["Chat"]
 *      responses:
 *          200:
 *              description: Successfully get list of chats
 *              content:
 *                  application/json:
 *                      example:
 *                       [
 *                          {
 *                               "isPrivate": true,
 *                               "members": [ "6242e4df6abf9b36a9bd5ba4", "6241712667f941901dcc533f" ],
 *                               "_id": "624c00056c71316fc3377538",
 *                               "createdAt": "date",
 *                               "updatedAt": "date",
 *                               "lastMessage": "some-message",
 *                               "unread": 0
 *                          }
 *                       ]
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.get('/', protect, validate(validateListChat), list);

/**
 * @swagger
 * /api/v1/chats/unread-messages:
 *  get:
 *      summary: Start to chat
 *      security:
 *          - BearerAuth: []
 *      description: Start chat
 *      tags: ["Chat"]
 *      responses:
 *          200:
 *              description: Successfully get list of chats
 *              content:
 *                  application/json:
 *                      example:
 *                          {unread: 10}
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
//@ts-ignore
router.get('/unread-messages', protect, unreadMessages);

export default router;
