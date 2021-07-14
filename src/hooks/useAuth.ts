import { useState } from 'react'
import { UserData } from '../model'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
export default function useAuth(): [
  boolean,
  UserData | undefined,
  (user: UserData) => void,
  () => void
] {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData>()
  function authenticate(user: UserData) {
    setIsAuthenticated(true)
    setUserData(user)
  }
  function signout() {
    setIsAuthenticated(false)

    // perform fence logout
    window.location.assign(`/user/logout?next=${window.location.href}`)
  }
  return [isAuthenticated, userData, authenticate, signout]
}
