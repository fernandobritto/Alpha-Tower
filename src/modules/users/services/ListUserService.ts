import { getCustomRepository } from 'typeorm'
import User from '../database/entities/User'
import UsersRepository from '../database/repositories/UsersRepository'

class ListUserService {
  public async execute(): Promise<User[]> {
    const usersRepository = getCustomRepository(UsersRepository)

    const users = usersRepository.find()

    return users
  }
}

export default ListUserService
