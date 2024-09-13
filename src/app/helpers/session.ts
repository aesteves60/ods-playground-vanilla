const sessionTokenKey = 'ods-playground-vanilla-session-token'

function deleteSessionToken() {
  localStorage.removeItem(sessionTokenKey)
}

function getSessionToken() {
  return localStorage.getItem(sessionTokenKey)
}

function hasSessionToken() {
  return Boolean(getSessionToken())
}

function setSessionToken(token: string) {
  localStorage.setItem(sessionTokenKey, token)
}

export {
  deleteSessionToken,
  getSessionToken,
  hasSessionToken,
  setSessionToken,
}