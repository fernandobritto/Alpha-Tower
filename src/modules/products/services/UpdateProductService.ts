import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../database/entities/Product'
import ProductsRepository from '../database/repositories/ProductsRepository'

interface IRequest {
  id: string
  name: string
  price: number
  quantity: number
  description: string
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
    description,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository)

    const product = await productsRepository.findOne(id)

    if (!product) {
      throw new AppError('Product not found.')
    }

    const productExists = await productsRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already one product with this name')
    }

    product.name = name
    product.description = description
    product.price = price
    product.quantity = quantity

    await productsRepository.save(product)

    return product
  }
}

export default UpdateProductService
