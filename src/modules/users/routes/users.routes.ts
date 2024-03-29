import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import multer from 'multer'
import uploadConfig from '@config/upload'
import UsersController from '../controllers/UsersController'
import isAuthenticated from '@shared/middlewares/isAuthenticated'
import UserAvatarController from '../controllers/UserAvatarController'

const usersRouter = Router()
const usersController = new UsersController()
const usersAvatarController = new UserAvatarController()

const upload = multer(uploadConfig)

usersRouter.get('/', isAuthenticated, usersController.index)

usersRouter.get(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.show,
)

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
)

usersRouter.put(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.update,
)

usersRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
)

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
)

export default usersRouter
