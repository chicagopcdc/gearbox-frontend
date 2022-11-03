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
  })
}

export function readCache<T>(key: string) {
  const data = localStorage.getItem(key)
  if (data !== null) return JSON.parse(data) as T
  return null
}

export function writeCache(key: string, data: string) {
  return localStorage.setItem(key, data)
}
