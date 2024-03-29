import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../database/entities/Product'
import ProductsRepository from '../database/repositories/ProductsRepository'

interface IRequest {
  id: string
}

class ShowProductService {
  public async execute({ id }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository)

    const product = await productsRepository.findOne(id)

    if (!product) {
      throw new AppError('Product not found.')
    }

    return product
  }
}

export default ShowProductService
