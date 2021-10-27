import { Router } from 'express';
import { validate } from '../../services/validation';
import { validateGetUrl, validatePutUrl } from '../../constants/aws';
import generateGetUrl from './generate-get-url';
import generatePutUrl from './generate-put-url';
const router = Router();

/**
 * @swagger
 * /api/v1/aws/generate-get-url:
 *  post:
 *      summary: Returns successfully generated get url
 *      description: generate get url
 *      tags: ["AWS"]
 *      requestBody:
 *          description: generate get url attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GenerateGetUrl'
 *              example:
 *                {
 *                 "key":"some-key",
 *                }
 *      responses:
 *          201:
 *             description: Successfully generate get url
 *             content:
 *                 application/json:
 *                     example:
 *                        {
 *                          "url": "url"
 *                        }
 *          400:
 *             $ref: '#/components/responses/BadRequestError'
 */
router.post('/generate-get-url', validate(validateGetUrl), generateGetUrl);

/**
 * @swagger
 * /api/v1/aws/generate-put-url:
 *  post:
 *      summary: Returns successfully generate put url
 *      description: generate put url
 *      tags: ["AWS"]
 *      requestBody:
 *          description: generate put url attributes
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GeneratePutUrl'
 *              example:
 *                {
 *                 "key":"object-key",
 *                 "contentType": "image",
 *                }
 *      responses:
 *          200:
 *              description: Successfully generate put url
 *              content:
 *                  application/json:
 *                      example:
 *                        {
 *                          "url": "url"
 *                        }
 */
router.post('/generate-put-url', validate(validatePutUrl), generatePutUrl);

export default router;
