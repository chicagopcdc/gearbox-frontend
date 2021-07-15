import { useState } from 'react'
import { RegisterUserInput, UserData } from '../model'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
export default function useAuth(): {
  isAuthenticated: boolean
  isRegistered: boolean
  user?: UserData
  authenticate: (user: UserData) => void
  register: (input: RegisterUserInput) => Promise<void>
  signout: () => void
} {
  const [userData, setUserData] = useState<UserData>()
  function authenticate(user: UserData) {
    setUserData(user)
  }
  async function register({
    reviewStatus,
    ...userInformation
  }: RegisterUserInput) {
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

    setUserData(registeredUserData)
  }
  function signout() {
    setUserData(undefined)

    // perform fence logout
    window.location.assign(`/user/logout?next=${window.location.href}`)
  }
  return {
    isAuthenticated: userData !== undefined,
    isRegistered:
      userData !== undefined && userData.authz?.['/portal']?.length > 0,
    user: userData,
    authenticate,
    register,
    signout,
  }
}
