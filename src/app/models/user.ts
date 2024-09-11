type UserApiData = {
  email: string
  firstName: string
  id: number
  image: string
  ip: string
  lastName: string
  phone: string
  role: 'admin' | 'moderator' | 'user'
}

type UserProps = {
  email: string
  firstName: string
  id: number
  image: string
  ip: string
  lastName: string
  phone: string
  role: 'admin' | 'moderator' | 'user'
}

class User {
  email: string
  firstName: string
  id: number
  image: string
  ip: string
  lastName: string
  phone: string
  role: 'admin' | 'moderator' | 'user'

  constructor(props: UserProps) {
    this.email = props.email
    this.firstName = props.firstName
    this.id = props.id
    this.image = props.image
    this.ip = props.ip
    this.lastName = props.lastName
    this.phone = props.phone
    this.role = props.role
  }

  static fromApi(props: UserApiData): User {
    return new User({
      email: props.email,
      firstName: props.firstName,
      id: props.id,
      image: props.image,
      ip: props.ip,
      lastName: props.lastName,
      phone: props.phone,
      role: props.role,
    })
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }

  toApi(): Omit<UserApiData, 'id'> {
    return {
      email: this.email,
      firstName: this.firstName,
      image: this.image,
      ip: this.ip,
      lastName: this.lastName,
      phone: this.phone,
      role: this.role,
    }
  }
}

export type {
  UserApiData,
  UserProps,
}
export { User }
