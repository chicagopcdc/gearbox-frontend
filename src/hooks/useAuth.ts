import { useState } from 'react'
import { UserData } from '../model'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
export default function useAuth(): [
  boolean,
  string,
  (user: UserData, cb?: () => void) => void,
  (cb?: () => void) => void
] {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData>()
  const authenticate = (user: UserData, cb?: () => void) => {
    setIsAuthenticated(true)
    setUserData(user)
    if (cb) cb()
  }
  const signout = (cb?: () => void) => {
    setIsAuthenticated(false)
    if (cb) cb()

    // perform fence logout
    window.location.assign(`/user/logout?next=${window.location.href}`)
  }
  return [isAuthenticated, userData?.username ?? '', authenticate, signout]
}
