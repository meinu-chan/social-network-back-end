import { Router } from 'express';
import { validate } from '../../services/validation';
import { protect } from '../../services/access';
import signIn from './sign-in';
import signUp from './sign-up';
import refreshTokens from './refresh-token';
import logOut from './log-out';
import { validateSignUp, validateSignIn } from '../../constants/session';

const router = Router();

/**
 * @swagger
 * /api/v1/session/sign-up:
 *  post:
 *      summary: Returns successfully sign-up user
 *      description: Sign-up user route
 *      tags: ["Sign"]
 *      requestBody:
 *          description: sign-up user attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SignUp'
 *              example:
 *                {
 *                 "email":"a1@a.com",
 *                 "password": "TestA!1234",
 *                 "fullName": "Test A",
 *                }
 *      responses:
 *          201:
 *             description: Successfully sign-up user
 *             content:
 *                 application/json:
 *                     example:
 *                        {
 *                          "accessToken": "access-token",
 *                          "refreshToken": "refresh-token",
 *                          "user": {
 *                            "_id": "user-id",
 *                            "email": "example@mail.com",
 *                            "fullName": "User Name",
 *                          }
 *                        }
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 */
router.post('/sign-up', validate(validateSignUp), signUp);

/**
 * @swagger
 * /api/v1/session/sign-in:
 *  post:
 *      summary: Returns successfully sign-in user and tokens
 *      description: Sign-in user route
 *      tags: ["Sign"]
 *      requestBody:
 *          description: sign-in user attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SignIn'
 *              example:
 *                {
 *                 "email":"a1@a.com",
 *                 "password": "TestA!1234",
 *                }
 *      responses:
 *          200:
 *              description: Successfully sign-in user
 *              content:
 *                  application/json:
 *                      example:
 *                        {
 *                          "accessToken": "access-token",
 *                          "refreshToken": "refresh-token",
 *                          "user": {
 *                            "_id": "user-id",
 *                            "email": "example@mail.com",
 *                            "fullName": "User Name",
 *                          }
 *                        }
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
router.post('/sign-in', validate(validateSignIn), signIn);

/**
 * @swagger
 * /api/v1/session/refresh-tokens:
 *  put:
 *      summary: Refresh access tokens
 *      description: Refresh access tokens
 *      tags: ["Sign"]
 *      responses:
 *          200:
 *              description: Successfully refreshed tokens
 *              content:
 *                  application/json:
 *                      example:
 *                       {
 *                           "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRiNDI2ZWIyYzJlOTQ2ZWU5NTFiMzciLCJlbWFpbCI6ImExQGEuY29tIiwiZnVsbE5hbWUiOiJUZXN0IEEiLCJpYXQiOjE2MTU1NTg4ODgsImV4cCI6MTYxNTU2MDY4OH0.8C_ewCC8pq28zKtj_UG6WnneuEUAB5lzLZ3Gg6saJFg",
 *                           "refreshToken": "9a95a7050360137d147a04d607c3beee4b5d957c323beac733ce5fbefdd6dd21",
 *                       }
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
router.put('/refresh-tokens', refreshTokens);

/**
 * @swagger
 * /api/v1/session/log-out:
 *  post:
 *      summary: Log out
 *      security:
 *          - BearerAuth: []
 *      description: Log out and delete device session
 *      tags: ["Sign"]
 *      responses:
 *          204:
 *              description: Successfully logged out
 *          401:
 *             $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *             $ref: '#/components/responses/NotFoundError'
 */
// @ts-ignore
router.post('/log-out', protect, logOut);

export default router;
