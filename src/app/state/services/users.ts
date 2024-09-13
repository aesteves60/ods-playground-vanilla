/* eslint-disable @typescript-eslint/unbound-method */
import { User, UserApiData } from '@app/models/user'
import { erase, get, post, put } from '@app/helpers/http'
import { config } from '@app/config'

async function count() {
  return get<{ total: number }>(`${config.api.users}?limit=1&select=id`)
    .then(({ total }) => total)
}

async function create(user: User) {
  return post<UserApiData>(`${config.api.users}/add`, user.toApi())
    .then(User.fromApi)
}

async function deleteUser(id: number) {
  return erase(`${config.api.users}/${id}`)
    .then(() => id)
}

async function getById(id: number) {
  return get<UserApiData>(`${config.api.users}/${id}`)
    .then(User.fromApi)
}

async function list(page = 0, perPage = 10) {
  const skip = Math.max(0, (page - 1) * perPage)

  return get<{ users?: UserApiData[], total: number }>(`${config.api.users}?skip=${skip}&limit=${perPage}`)
    .then(({ users, total }) => ({
      count: total,
      users: (users ?? []).map(User.fromApi),
    }))
}

async function update(user: User) {
  return put<UserApiData>(`${config.api.users}/${user.id}`, user.toApi())
    .then(User.fromApi)
}

export {
  count,
  create,
  deleteUser,
  getById,
  list,
  update,
}
