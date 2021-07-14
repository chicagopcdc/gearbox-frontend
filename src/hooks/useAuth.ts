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
  const [username, setUsername] = useState('')
  const authenticate = (user: UserData, cb?: () => void) => {
    setIsAuthenticated(true)
    setUsername(user.username)
    if (cb) cb()
  }
  const signout = (cb?: () => void) => {
    setIsAuthenticated(false)
    if (cb) cb()
  }
  return [isAuthenticated, username, authenticate, signout]
}
