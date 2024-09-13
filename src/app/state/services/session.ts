import { deleteSessionToken, setSessionToken } from '../../helpers/session'
import { config } from '../../config'
import { post } from '../../helpers/http'

async function signIn(username: string, password: string) {
  const response = await post<{ token: string }>(config.api.signIn, {
    password,
    username,
  })
  setSessionToken(response.token);
  return response;
}

function signOut() {
  return deleteSessionToken()
}

export {
  signIn,
  signOut,
}
