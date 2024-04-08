import { logout } from './auth'

export function fetchGearbox(input: RequestInfo, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-csrf-token': document.cookie.replace(
        /(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      ),
      ...(init.headers ?? {}),
    },
  }).then((res) => {
    const status = res.status

    // '/user/user/' endpoint is special and has other logic to clear logged in user, so excluded it here
    if (typeof input === 'string' && input !== '/user/user/') {
      if (status === 401 || status === 403) {
        localStorage.clear()
        logout()
      } else if (!res.ok) {
        throw new Error('The API request failed!')
      }
    }
    return res
  })
}

export function readCache<T>(key: string) {
  const data = sessionStorage.getItem(key)
  if (data !== null) return JSON.parse(data) as T
  return null
}

export function writeCache(key: string, data: string) {
  return sessionStorage.setItem(key, data)
}
