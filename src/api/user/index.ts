import { Router } from 'express';
import { protect } from '../../services/access';
import showMe from './show-me';
const router = Router();

/**
 * @swagger
 * /api/v1/users/me:
 *  post:
 *      summary: Successfully got me
 *      description: Successfully got me
 *      security:
 *          - BearerAuth: []
 *      tags: ["User"]
 *      requestBody:
 *      responses:
 *          201:
 *             description: Successfully got me
 *             content:
 *                 application/json:
 *                     example:
 *                        {
 *                            "_id": "user-id",
 *                            "email": "example@mail.com",
 *                            "fullName": "User Name",
 *                        }
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 */
//@ts-ignore
router.get('/me', protect, showMe);

export default router;
