import { getSessionToken } from './session'

enum HTTP_METHOD {
  delete = 'DELETE',
  get = 'GET',
  post = 'POST',
  put = 'PUT',
}

async function onFetchResponse(response: Response) {
  if (!response.ok) {
    return Promise.reject(`Request failed : ${response.status}`)
  }

  return response.json()
    .catch((error) => {
      return Promise.reject(error)
    })
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

async function request(url: string, method: HTTP_METHOD, body?: unknown) {
  const requestOptions = getRequestOptions(method, body)

  return fetch(url, requestOptions)
    .then(onFetchResponse)
}

async function erase(url: string) {
  return request(url, HTTP_METHOD.delete)
}

async function get(url: string) {
  return request(url, HTTP_METHOD.get)
}

async function post(url: string, body?: unknown) {
  return request(url, HTTP_METHOD.post, body)
}

async function put(url: string, body?: unknown) {
  return request(url, HTTP_METHOD.put, body)
}

export {
  erase,
  get,
  post,
  put,
}