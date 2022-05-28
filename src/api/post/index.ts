import { Router } from 'express';
import { validate } from '../../services/validation';
import { protect } from '../../services/access';
import { validatePostCreate, validatePostList, validatePostRemove } from '../../constants/post';
import create from './create';
import remove from './remove';
import list from './list';

const router = Router();

/**
 * @swagger
 * /api/v1/posts/{id}:
 *  post:
 *      summary: Create post
 *      security:
 *          - BearerAuth: []
 *      description: Create post
 *      tags: ["Post"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: The post id
 *      requestBody:
 *          description: send message attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreatePost'
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
 *                          _id: "id",
 *                          text: "text",
 *                          user: "user-object",
 *                          createdAt: "date",
 *                          updatedAt: "date"
 *                       }
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.post('/:id', protect, validate(validatePostCreate), create);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *  delete:
 *      summary: Delete post
 *      security:
 *          - BearerAuth: []
 *      description: Delete post
 *      tags: ["Post"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: The post id
 *      responses:
 *          204:
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
router.delete('/:id', protect, validate(validatePostRemove), remove);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *  get:
 *      summary: Get post
 *      description: Get post
 *      tags: ["Post"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: user id
 *      responses:
 *          204:
 *              description: Successfully got post list
 *              content:
 *                  application/json:
 *                      example:
 *                       [
 *                          {
 *                             _id: "id",
 *                             text: "text",
 *                             user: "user-object",
 *                             createdAt: "date",
 *                             updatedAt: "date"
 *                          }
 *                       ]
 *
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.get('/:id', validate(validatePostList), list);

export default router;
