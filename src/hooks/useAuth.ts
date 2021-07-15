import { useEffect, useState } from 'react'
import { RegisterInput, UserData } from '../model'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
export default function useAuth(): {
  isAuthenticated: boolean
  isRegistered: boolean
  user?: UserData
  authenticate: (user: UserData) => void
  register: (input: RegisterInput) => Promise<void>
  signout: () => void
} {
  const [userData, setUserData] = useState<UserData>()
  async function register({ reviewStatus, ...userInformation }: RegisterInput) {
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

  const isAuthenticated = userData !== undefined
  useEffect(() => {
    if (!isAuthenticated)
      fetch('/user/user/')
        .then((res) => {
          if (!res.ok)
            throw new Error('Error: Failed to fetch user information!')
          return res.json() as Promise<UserData>
        })
        .then((user) => {
          if (user.username === undefined)
            throw new Error('Error: Missing username!')
          setUserData(user)
        })
        .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isAuthenticated,
    isRegistered:
      isAuthenticated && (userData?.authz?.['/portal'] ?? [])?.length > 0,
    user: userData,
    authenticate: setUserData,
    register,
    signout,
  }
}
