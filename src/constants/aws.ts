import { bodyStringExist } from './general';

export const validateGetUrl = [bodyStringExist('key')];

export const validatePutUrl = [bodyStringExist('key'), bodyStringExist('contentType')];
