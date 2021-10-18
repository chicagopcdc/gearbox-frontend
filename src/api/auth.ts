import { RegisterInput, UserData } from '../model'

export function fetchUser() {
  return fetch('/user/user/').then((res) => {
    if (!res.ok) throw new Error('Error: Failed to fetch user information!')
    return res.json() as Promise<UserData>
  })
}

export function keepUserSessionAlive() {
  fetch('/user/user/')
}

export function loginWithGoogle() {
  window.location.assign(`/user/login/google?redirect=${window.location.href}`)
}

export function logout() {
  window.location.assign(`/user/logout?next=${window.location.href}`)
}

export async function registerUser({
  reviewStatus,
  ...userInformation
}: RegisterInput) {
  const userResponse = await fetch('/user/user', {
    body: JSON.stringify(userInformation),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  })
  if (!userResponse.ok) throw new Error('Failed to update user information.')
  const registeredUserData = (await userResponse.json()) as UserData

  if (Object.values(reviewStatus).filter(Boolean).length > 0) {
    const documentsResponse = await fetch('/user/user/documents', {
      body: JSON.stringify(reviewStatus),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    if (!documentsResponse.ok)
      throw new Error('Failed to update document review status.')
    registeredUserData.docs_to_be_reviewed = await documentsResponse.json()
  }

  return registeredUserData
}
