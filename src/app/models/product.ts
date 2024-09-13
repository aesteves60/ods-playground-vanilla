
interface ProductApiData {
  brand?: string
  category?: string
  description: string
  discountPercentage?: number
  id: number
  images: string[]
  price: number
  rating?: number
  stock?: number
  thumbnail: string
  title: string
}

interface ProductProps {
  description: string
  id: number
  images?: string[]
  price: number
  thumbnail: string
  title: string
}

class Product {
  description: string
  id: number
  images: string[]
  price: number
  thumbnail: string
  title: string

  constructor(props: ProductProps) {
    this.description = props.description
    this.id = props.id
    this.images = props.images ?? []
    this.price = props.price
    this.thumbnail = props.thumbnail
    this.title = props.title
  }

  static fromApi(props: ProductApiData): Product {
    return new Product({
      description: props.description,
      id: props.id,
      images: props.images,
      price: props.price,
      thumbnail: props.thumbnail,
      title: props.title,
    })
  }

  toApi(): Omit<ProductApiData, 'id'> {
    return {
      description: this.description,
      images: this.images,
      price: this.price,
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
