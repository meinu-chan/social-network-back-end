import { Router } from 'express';
import { protect } from '../../services/access';
import { validate } from '../../services/validation';
import { validateLikeList, validateLikePost } from '../../constants/like';
import like from './like';
import list from './list';

const router = Router();

/**
 * @swagger
 * /api/v1/likes/{id}:
 *  post:
 *      summary: React on post
 *      description: like post
 *      tags: ["Post"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: post id
 *      responses:
 *          204:
 *              description: Successfully got post list
 *              content:
 *                  application/json:
 *                      example:
 *                       {}
 *
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.post('/:id', protect, validate(validateLikePost), like);

/**
 * @swagger
 * /api/v1/likes/:id:
 *  get:
 *      summary: post reactions
 *      description: post likes
 *      tags: ["Post"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: post id
 *      responses:
 *          204:
 *              description: Successfully got post's reaction
 *              content:
 *                  application/json:
 *                      example:
 *                       {
 *                          isMeLiked: true,
 *                          likesCount: 1
 *                       }
 *
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.get('/:id', protect, validate(validateLikeList), list);

export default router;
