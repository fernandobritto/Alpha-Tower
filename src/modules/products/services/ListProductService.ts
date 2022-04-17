import { getCustomRepository } from 'typeorm'
import Product from '../database/entities/Product'
import { ProductsRepository } from '../database/repositories/ProductsRepository'

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductsRepository)

    const products = productsRepository.find()

    return products
  }
}

export default ListProductService
