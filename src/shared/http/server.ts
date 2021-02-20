import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errors } from 'celebrate'
import routes from '@shared/routes'
import AppError from '@shared/errors/AppError'
import '@shared/database'

const app = express()

app.use(cors())
app.use(express.json())

app.use(routes)

app.use(errors())

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(8084, () => console.log('Server OK - 200'))
