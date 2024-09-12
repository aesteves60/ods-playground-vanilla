/* eslint-disable no-shadow */
import { getSessionToken } from './session'

enum HTTP_METHOD {
  delete = 'DELETE',
  get = 'GET',
  post = 'POST',
  put = 'PUT',
}

async function onFetchResponse(response: Response) {
  if (!response.ok) {
    return Promise.reject(new Error(`Request failed : ${response.status}`))
  }

  return response.json()
    .catch((error: unknown) =>
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      Promise.reject(error)
    ) as Promise<unknown>
}

function getRequestOptions(method: HTTP_METHOD, body?: unknown) {
  const token = getSessionToken()

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  }

  const requestOptions: RequestInit = { headers, method }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  return requestOptions
}

function request(url: string, method: HTTP_METHOD, body?: unknown) {
  const requestOptions = getRequestOptions(method, body)

  return fetch(url, requestOptions)
    .then(onFetchResponse)
}

function erase<T>(url: string) {
  return request(url, HTTP_METHOD.delete) as Promise<T>
}

function get<T>(url: string) {
  return request(url, HTTP_METHOD.get) as Promise<T>
}

function post<T>(url: string, body?: unknown) {
  return request(url, HTTP_METHOD.post, body) as Promise<T>
}

async function put<T>(url: string, body?: unknown) {
  return request(url, HTTP_METHOD.put, body) as Promise<T>
}

export {
  erase,
  get,
  post,
  put,
}
