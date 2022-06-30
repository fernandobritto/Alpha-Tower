import { Router } from 'express'
import productsRouter from '@modules/products/routes/products.routes'

const router = Router()

router.use('/products', productsRouter)

export default router
