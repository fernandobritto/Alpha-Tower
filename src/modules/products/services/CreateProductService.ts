import { getCustomRepository } from 'typeorm'

import AppError from '@shared/errors/AppError'
import Product from '../database/entities/Product'
import { ProductsRepository } from '../database/repositories/ProductsRepository'

interface IRequest {
  name: string
  price: number
  quantity: number
}

class CreateProductservice {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository)
    const productExists = await productsRepository.findByName(name)
    if (productExists) {
      throw new AppError('Product already exists')
    }

    const newProduct = productsRepository.create({
      name,
      price,
      quantity,
    })
    await productsRepository.save(newProduct)

    return newProduct
  }
}

export default CreateProductservice
