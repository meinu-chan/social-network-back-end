import { body, CustomValidator, param, query, ValidationChain } from 'express-validator';
import { isValidObjectId } from 'mongoose';

export const bodyStringExist = (field: string): ValidationChain =>
  body(field)
    .exists()
    .withMessage('must exist')
    .bail()
    .isString()
    .withMessage('- should be a string.');

export const bodyStringOptional = (field: string): ValidationChain =>
  body(field).optional().isString().withMessage('- should be a string.');

export const isValidMongoId: CustomValidator = (value) =>
  isValidObjectId(value.toString()) ? value : Promise.reject('Mongo id validation fail');

export const isValidDate: CustomValidator = (date: string) => {
  const validDate = new Date(date);

  const error = 'invalid date';

  if (validDate.toString().toLowerCase() === error) {
    return Promise.reject(error);
  }

  return true;
};

export const validateMongoId = [
  param('id')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('- can not be empty')
    .bail()
    .isString()
    .bail()
    .custom(isValidMongoId),
];

export const validatePaginationQuery = [
  query('limit')
    .exists()
    .withMessage('- per page limit is not passed')
    .bail()
    .isInt({ gt: 0 })
    .withMessage('- per page limit should be greater then 0'),
  query('page')
    .exists()
    .withMessage('- page is not selected')
    .bail()
    .isInt({ gt: 0 })
    .withMessage('- page should be greater then 0'),
];

export const pagination = (limit: number, page: number) => {
  limit = limit >= 100 ? 100 : Number(limit);

  return {
    skip: limit * (page - 1),
    limit,
  };
};
