import { Joi, Segments, celebrate } from "celebrate";

export const createAnnouncementValidator = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(10).max(200).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().valid("sale", "service", "job", "other").required(),
    contactInfo: Joi.string().min(5).max(200).required(),
  }),
});

export const updateAnnouncementValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(5).max(100).optional(),
    description: Joi.string().min(10).max(200).optional(),
    price: Joi.number().positive().optional(),
    category: Joi.string().valid("sale", "service", "job", "other").optional(),
    contactInfo: Joi.string().min(5).max(200).optional(),
  }).min(1),
});

export const getAnnouncementValidator = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    take: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().min(1).max(100).optional(),
    sort: Joi.string().valid("newest", "oldest").default("newest"),
  }),
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
});

export const deleteAnnouncementValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().required(),
  }),
});
