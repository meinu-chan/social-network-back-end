import { Router } from 'express';
import sessionV1 from './session';
import awsV1 from './aws';
import userV1 from './user';

const router = Router();

router.use('/session', sessionV1);
router.use('/aws', awsV1);
router.use('/users', userV1);

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      BearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  schemas:
 *      Session:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: User's email
 *              password:
 *                  type: string
 *                  description: User's password
 *      SignUp:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: user's email
 *                  required: true
 *              fullName:
 *                  type: string
 *                  description: user's fullName
 *                  required: true
 *              password:
 *                  type: string
 *                  description: user's password
 *                  required: true
 *              birthday:
 *                  type: string
 *                  description: user's birthday
 *              phone:
 *                  type: string
 *                  description: user's phone
 *              job:
 *                  type: string
 *                  description: user's job
 *              school:
 *                  type: string
 *                  description: user's school
 *              university:
 *                  type: string
 *                  description: user's university
 *              country:
 *                  type: object
 *                  description: user's country
 *                  required:
 *                      - name
 *                      - flag
 *                  properties:
 *                      name:
 *                          type: string
 *                          description: country name
 *                      flag:
 *                          type: string
 *                          description: country flag
 *      SignIn:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: user's email
 *                  required: true
 *              password:
 *                  type: string
 *                  description: user's password
 *                  required: true
 *      GenerateGetUrl:
 *          type: object
 *          properties:
 *              key:
 *                  type: string
 *                  description: object key
 *                  required: true
 *      GeneratePutUrl:
 *          type: object
 *          properties:
 *              key:
 *                  type: string
 *                  description: object key
 *                  required: true
 *              contentType:
 *                  type: string
 *                  description: object key
 *                  required: true
 *  responses:
 *      UnauthorizedError:
 *          description: Access token is missing or invalid or user does not longer exists
 *          content:
 *              application/json:
 *                  example:
 *                      {
 *                        "status": "fail",
 *                        "message": "You are not logged in! Please log in to get access."
 *                      }
 *      NotFoundError:
 *          description: Request information or entity not found
 *          content:
 *              application/json:
 *                  example:
 *                      {
 *                        "status": "fail",
 *                        "message": "Not found."
 *                      }
 *      BadRequestError:
 *          description: Request with invalid or wrong data
 *          content:
 *              application/json:
 *                  example:
 *                      {
 *                        "status": "fail",
 *                        "message": "Invalid input data. Path 'email' must not be empty ()."
 *                      }
 *      ConflictError:
 *          description: The request could not be completed due to a conflict with the current state of the target resource.
 *          content:
 *              application/json:
 *                  example:
 *                      {
 *                        "status": "fail",
 *                        "message": "Category already set for this module."
 *                      }
 *      ForbiddenError:
 *          description: The server understood the request but refuses to authorize it.
 *          content:
 *              application/json:
 *                  example:
 *                      {
 *                          "status": "fail",
 *                          "message": "You don't have permission to perform this action"
 *                      }
 */

export default router;
