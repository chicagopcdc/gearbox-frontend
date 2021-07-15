import { useState } from 'react'
import { UserData } from '../model'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
export default function useAuth(): {
  isAuthenticated: boolean
  user?: UserData
  authenticate: (user: UserData) => void
  signout: () => void
} {
  const [userData, setUserData] = useState<UserData>()
  function authenticate(user: UserData) {
    setUserData(user)
  }
  function signout() {
    setUserData(undefined)

    // perform fence logout
    window.location.assign(`/user/logout?next=${window.location.href}`)
  }
  return {
    isAuthenticated: userData !== undefined,
    user: userData,
    authenticate,
    signout,
  }
}
