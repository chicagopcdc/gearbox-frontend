import { RegisterInput, UserData } from '../model'
import { fetchGearbox } from './utils'

export function fetchUser() {
  return fetchGearbox('/user/user/').then((res) => {
    if (!res.ok) throw new Error('Error: Failed to fetch user information!')
    return res.json() as Promise<UserData>
  })
}

export function keepUserSessionAlive() {
  fetchGearbox('/user/user/')
}

export function loginWithGoogle() {
  window.location.assign(`/user/login/google?redirect=${window.location.href}`)
}

export function logout() {
  window.location.assign(`/user/logout?next=${window.location.href}`)
}

export function updateDocsReviewStatus(status: RegisterInput['reviewStatus']) {
  return fetchGearbox('/user/user/documents', {
    body: JSON.stringify(status),
    method: 'POST',
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to update document review status.')
    return res.json() as Promise<UserData['docs_to_be_reviewed']>
  })
}

export async function registerUser({
  reviewStatus,
  ...userInformation
}: RegisterInput) {
  const userResponse = await fetchGearbox('/user/user', {
    body: JSON.stringify(userInformation),
    method: 'PUT',
  })
  if (!userResponse.ok) throw new Error('Failed to update user information.')
  const registeredUserData = (await userResponse.json()) as UserData

  if (Object.values(reviewStatus).filter(Boolean).length > 0) {
    const docsToBeReviewed = await updateDocsReviewStatus(reviewStatus)
    registeredUserData.docs_to_be_reviewed = docsToBeReviewed
  }
  return registeredUserData
}
