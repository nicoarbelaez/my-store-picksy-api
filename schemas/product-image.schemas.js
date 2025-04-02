import Joi from 'joi';
import { ALLOWED_IMAGE_MIME_TYPES } from '../utils/consts.js';

const id = Joi.number().integer().positive();
const imgurId = Joi.string();
const deletehash = Joi.string();
const width = Joi.number().integer().positive();
const height = Joi.number().integer().positive();
const size = Joi.number().integer().positive();
const link = Joi.string().uri();
const datetime = Joi.date();
const originalname = Joi.string();
const fieldname = Joi.string();
const encoding = Joi.string();
const mimetype = Joi.string()
  .valid(...ALLOWED_IMAGE_MIME_TYPES)
  .required()
  .messages({
    'any.only': `Some file is not of the correct type. Only allowed: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}.`,
  });
const buffer = Joi.binary();

// Este esquema representa la estructura del archivo tal como lo recibe Multer
export const multerProductImageSchema = Joi.array().items({
  fieldname: fieldname.required(),
  originalname: originalname.required(),
  encoding: encoding.required(),
  mimetype: mimetype.required(),
  buffer: buffer.required(),
  size: size.required(),
});

// Este esquema se usa para guardar en la base de datos y posteriormente responder
export const createProductImageSchema = Joi.object({
  id: id.required(),
  imgurId: imgurId.required(),
  deletehash: deletehash.required(),
  mimetype: mimetype.required(),
  width: width.required(),
  height: height.required(),
  size: size.required(),
  link: link.required(),
  datetime: datetime.required(),
  originalname: originalname.required(),
});
