import { config } from '../../config'
import { post } from '../../helpers/http'
import { deleteSessionToken, setSessionToken } from '../../helpers/session'

async function signIn(username: string, password: string) {
  const response = await post(config.api.signIn, {
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