
interface CategoryApiData {
  slug: string
  name: string
  url: string
}

interface CategoryProps {
  slug: string
  name: string
  url: string
}

class Category {
  slug: string
  name: string
  url: string

  constructor(props: CategoryProps) {
    this.slug = props.slug
    this.name = props.name
    this.url = props.url
  }

  static fromApi(props: CategoryApiData): Category {
    return new Category({
      name: props.name,
      slug: props.slug,
      url: props.url,
    })
  }

  toApi(): Omit<CategoryApiData, 'id'> {
    return {
      name: this.name,
      slug: this.slug,
      url: this.url,
    }
  }
}

export {
  type CategoryApiData,
  type CategoryProps,
  Category,
}
