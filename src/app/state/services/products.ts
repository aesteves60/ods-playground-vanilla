/* eslint-disable @typescript-eslint/unbound-method */
import { Product, ProductApiData } from '@app/models/product'
import { erase, get, post, put } from '@app/helpers/http'
import { config } from '@app/config'

async function create(product: Product) {
  return post<ProductApiData>(`${config.api.products}/add`, product.toApi())
    .then(Product.fromApi)
}

async function count() {
  return get<{ total: number }>(`${config.api.products}?limit=1&select=id`)
    .then(({ total }) => total)
}

async function deleteProduct(id: number) {
  return erase(`${config.api.products}/${id}`)
    .then(() => id)
}

async function getById(id: number) {
  return get<ProductApiData>(`${config.api.products}/${id}`)
    .then(Product.fromApi)
}

async function list(page = 0, perPage = 10) {
  const skip = Math.max(0, (page - 1) * perPage)

  return get<{products?: ProductApiData[], total: number }>(`${config.api.products}?skip=${skip}&limit=${perPage}`)
    .then(({ products, total }) => ({
      count: total,
      products: (products ?? []).map(Product.fromApi),
    }))
}

async function update(product: Product) {
  return put<ProductApiData>(`${config.api.products}/${product.id}`, product.toApi())
    .then(Product.fromApi)
}

export {
  create,
  count,
  deleteProduct,
  getById,
  list,
  update,
}
