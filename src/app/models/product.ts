
interface ProductApiData {
  brand?: string
  category: string
  description: string
  discountPercentage?: number
  id: number
  images: string[]
  minimumOrderQuantity: number
  price: number
  rating?: number
  returnPolicy: string
  stock: number
  thumbnail: string
  title: string
}

interface ProductProps {
  category: string
  description: string
  hasReturnPolicy: boolean
  id: number
  images?: string[]
  minimumOrderQuantity: number
  price: number
  restockTime: string
  stock: number
  thumbnail: string
  title: string
}

class Product {
  category: string
  description: string
  hasReturnPolicy: boolean
  id: number
  images: string[]
  minimumOrderQuantity: number
  price: number
  restockTime: string
  stock: number
  thumbnail: string
  title: string

  constructor(props: ProductProps) {
    this.category = props.category
    this.description = props.description
    this.hasReturnPolicy = props.hasReturnPolicy
    this.id = props.id
    this.images = props.images ?? []
    this.minimumOrderQuantity = props.minimumOrderQuantity
    this.price = props.price
    this.restockTime = props.restockTime
    this.stock = props.stock
    this.thumbnail = props.thumbnail
    this.title = props.title
  }

  static fromApi(props: ProductApiData): Product {
    // Random as the API does not provide any Date
    const randomDate = new Date(new Date().valueOf() - Math.random()*(1e+12))

    return new Product({
      category: props.category,
      description: props.description,
      hasReturnPolicy: props.returnPolicy !== 'No return policy',
      id: props.id,
      images: props.images,
      minimumOrderQuantity: props.minimumOrderQuantity,
      price: props.price,
      restockTime: `${randomDate.getHours().toString().padStart(2, '0')}:${randomDate.getMinutes().toString().padStart(2, '0')}`,
      stock: props.stock,
      thumbnail: props.thumbnail,
      title: props.title,
    })
  }

  toApi(): Omit<ProductApiData, 'id'> {
    return {
      category: this.category,
      description: this.description,
      images: this.images,
      minimumOrderQuantity: this.minimumOrderQuantity,
      price: this.price,
      returnPolicy: this.hasReturnPolicy ? '30 days return policy' : 'No return policy',
      stock: this.stock,
      thumbnail: this.thumbnail,
      title: this.title,
    }
  }
}

export {
  type ProductApiData,
  type ProductProps,
  Product,
}
