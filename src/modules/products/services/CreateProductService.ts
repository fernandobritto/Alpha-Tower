import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../database/entities/Product'
import ProductsRepository from '../database/repositories/ProductsRepository'

interface IRequest {
  name: string
  description: string
  price: number
  quantity: number
}

class CreateProductService {
  public async execute({
    name,
    description,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository)

    const productExists = await productsRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already one product with this name')
    }

    const product = productsRepository.create({
      name,
      description,
      price,
      quantity,
    })

    await productsRepository.save(product)

    return product
  }
}

export default CreateProductService
