import { Router } from 'express';
import { protect } from '../../services/access';
import { validate } from '../../services/validation';
import deleteMe from './delete-me';
import show from './show';
import showMe from './show-me';
import updateMe from './update-me';
import list from './list';
import nonPaginate from './non-paginate';
import {
  validateShowUser,
  validateUpdateMeUser,
  validateListUser,
  validateNonPaginatedListUser,
} from '../../constants/user';

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *  get:
 *      summary: Successfully got list of users
 *      description: Successfully got list of users
 *      tags: ["User"]
 *      parameters:
 *          - in: query
 *            name: limit
 *            schema:
 *                type: integer
 *            required: true
 *            description: Limit defines how many items per page should be displayed (> 0)
 *          - in: query
 *            name: page
 *            schema:
 *                type: integer
 *            required: true
 *            description: Page selects which page to return - &page=2&limit=5 returns 5 items skipping first 5 (>0)
 *      responses:
 *          200:
 *             description: Successfully got list of users
 *             content:
 *                 application/json:
 *                     example:
 *                        {
 *                            "count": 1,
 *                            "rows":[
 *                              {
 *                                  "_id": "user-id",
 *                                  "email": "example@mail.com",
 *                                  "fullName": "User Name",
 *                              }
 *                            ]
 *                        }
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 */
//@ts-ignore
router.get('/', validate(validateListUser), list);

/**
 * @swagger
 * /api/v1/users/non-paginated:
 *  get:
 *      summary: Successfully got list of users
 *      description: Successfully got list of users
 *      tags: ["User"]
 *      parameters:
 *          - in: query
 *            name: field
 *            schema:
 *                type: string
 *            description: Filter users by fullName and nickname
 *      responses:
 *          200:
 *             description: Successfully got list of users
 *             content:
 *                 application/json:
 *                     example:
 *                      [
 *                              {
 *                                  "_id": "user-id",
 *                                  "email": "example@mail.com",
 *                                  "fullName": "User Name",
 *                              }
 *                      ]
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 */
//@ts-ignore
router.get('/non-paginated', validate(validateNonPaginatedListUser), nonPaginate);

/**
 * @swagger
 * /api/v1/users/me:
 *  get:
 *      summary: Successfully got me
 *      description: Successfully got me
 *      security:
 *          - BearerAuth: []
 *      tags: ["User"]
 *      responses:
 *          200:
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

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *      summary: Successfully got user by id
 *      description: Successfully got user by id
 *      tags: ["User"]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: The user id
 *      requestBody:
 *      responses:
 *          200:
 *             description: Successfully got user by id
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
router.get('/:id', validate(validateShowUser), show);

/**
 * @swagger
 * /api/v1/users/me:
 *  put:
 *      summary: Successfully updated me
 *      description: Successfully updated me
 *      security:
 *          - BearerAuth: []
 *      tags: ["User"]
 *      requestBody:
 *          description: update me user attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SignIn'
 *              example:
 *                {
 *                 "fullName":"updated full name",
 *                 "nickname": "updated nickname",
 *                 "photo":"updated photo"
 *                }
 *      responses:
 *          200:
 *             description: Successfully updated me
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
router.put('/me', protect, validate(validateUpdateMeUser), updateMe);

/**
 * @swagger
 * /api/v1/users/me:
 *  delete:
 *      summary: Successfully deleted own account
 *      description: Successfully deleted own account
 *      security:
 *          - BearerAuth: []
 *      tags: ["User"]
 *      responses:
 *          204:
 *             description: Successfully deleted own account
 *             content:
 *                 application/json:
 *                     example:
 *                          null
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 */
//@ts-ignore
router.delete('/me', protect, deleteMe);

export default router;
