import { useState } from 'react'

// useFakeAuth inspired by https://reacttraining.com/react-router/web/example/auth-workflow
export default function useAuth(): [
  boolean,
  string,
  (username: string, cb?: () => void) => void,
  (cb?: () => void) => void
] {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const authenticate = (username: string, cb?: () => void) => {
    setIsAuthenticated(true)
    setUsername(username)
    if (cb) cb()
  }
  const signout = (cb?: () => void) => {
    setIsAuthenticated(false)
    if (cb) cb()
  }
  return [isAuthenticated, username, authenticate, signout]
}
