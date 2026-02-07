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
      }
    }
    return res
  })
}

const DEFAULT_CACHE_MAX_AGE_MS = 5 * 60 * 1000 // 5 minutes

export function readCache<T>(key: string, maxAgeMs = DEFAULT_CACHE_MAX_AGE_MS) {
  const raw = sessionStorage.getItem(key)
  if (raw === null) return null

  try {
    const { data, timestamp } = JSON.parse(raw)
    if (typeof timestamp === 'number' && Date.now() - timestamp > maxAgeMs) {
      sessionStorage.removeItem(key)
      return null
    }
    return data as T
  } catch {
    // Handle legacy cache entries without timestamp wrapper
    return JSON.parse(raw) as T
  }
}

export function writeCache(key: string, data: string) {
  return sessionStorage.setItem(
    key,
    JSON.stringify({ data: JSON.parse(data), timestamp: Date.now() })
  )
}

export function clearGearboxCache() {
  sessionStorage.removeItem('gearbox:studies')
  sessionStorage.removeItem('gearbox:eligiblity-criteria') // note: preserving existing typo in key
  sessionStorage.removeItem('gearbox:match-conditions')
}
