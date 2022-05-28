import { Router } from 'express';
import { validate } from '../../services/validation';
import { protect } from '../../services/access';
import create from './create';
import remove from './remove';
import list from './list';
import {
  validateCommentCreate,
  validateCommentList,
  validateCommentRemove,
} from '../../constants/comment';

const router = Router();

/**
 * @swagger
 * /api/v1/comments/{id}:
 *  post:
 *      summary: Create comment
 *      security:
 *          - BearerAuth: []
 *      description: Create comment
 *      tags: ["Comment"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: The comment id
 *      requestBody:
 *          description: create comment
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
 *                          post: "post-id",
 *                          createdAt: "date",
 *                          updatedAt: "date"
 *                       }
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.post('/:id', protect, validate(validateCommentCreate), create);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *  delete:
 *      summary: Delete post
 *      security:
 *          - BearerAuth: []
 *      description: Delete post
 *      tags: ["Comment"]
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
router.delete('/:id', protect, validate(validateCommentRemove), remove);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *  get:
 *      summary: Get post
 *      description: Get post
 *      tags: ["Comment"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: post id
 *      responses:
 *          200:
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
router.get('/:id', validate(validateCommentList), list);

export default router;
