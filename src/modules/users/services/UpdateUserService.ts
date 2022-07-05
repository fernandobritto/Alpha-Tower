import AppError from '@shared/erros/AppError'
import { hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'

interface IRequest {
  id: string
  name: string
  email: string
  password: string
}

class UpdateUserService {
  public async execute({ id, name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findById(id)

    if (!user) {
      throw new AppError('User not found.')
    }

    const emailExists = await usersRepository.findByEmail(email)

    if (emailExists) {
      throw new AppError('Email address already used.')
    }

    const hashedPassword = await hash(password, 8)

    user.name = name
    user.email = email
    user.password = hashedPassword

    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserService
