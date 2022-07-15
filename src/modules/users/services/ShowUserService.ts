import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import User from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'

class ShowUserService {
  public async execute(id: string): Promise<User | undefined> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findOne(id)

    if (!user) {
      throw new AppError('User not found.')
    }

    return user
  }
}

export default ShowUserService
