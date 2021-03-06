import { Request, Response, Router } from 'express'
import productsRouter from '@modules/products/routes/products.routes'
import usersRouter from '@modules/users/routes/users.routes'
import sessionsRouter from '@modules/users/routes/sessions.routes'
import passwordRouter from '@modules/users/routes/password.routes'

const routes = Router()

routes.use('/products', productsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)

routes.get('/', (request: Request, response: Response) => {
  return response.json('Alpha Tower Sales System')
})

export default routes
