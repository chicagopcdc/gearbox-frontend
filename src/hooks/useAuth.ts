import { useEffect, useRef, useState } from 'react'
import { RegisterInput, UserData } from '../model'
import {
  fetchUser,
  keepUserSessionAlive,
  logout,
  registerUser,
} from '../api/auth'

export default function useAuth(): {
  isAuthenticated: boolean
  isRegistered: boolean
  hasDocsToBeReviewed: boolean
  user?: UserData
  register: (input: RegisterInput) => Promise<void>
  signout: () => void
} {
  const [userData, setUserData] = useState<UserData>()
  function register(registerInput: RegisterInput) {
    return registerUser(registerInput).then(setUserData)
  }
  function signout() {
    setUserData(undefined)
    logout()
  }

  const isAuthenticated = userData !== undefined
  useEffect(() => {
    if (!isAuthenticated) fetchUser().then(setUserData).catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep access token alive
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (timer.current === undefined && isAuthenticated)
      timer.current = window.setInterval(
        keepUserSessionAlive,
        10 * 60 * 1000 // ten minutes
      )

    return () => {
      if (timer.current !== undefined) window.clearInterval(timer.current)
    }
  }, [isAuthenticated])

  const isRegistered =
    isAuthenticated && (userData?.authz?.['/portal'] ?? [])?.length > 0
  const hasDocsToBeReviewed =
    isRegistered && (userData.docs_to_be_reviewed ?? [])?.length > 0

  return {
    isAuthenticated,
    isRegistered,
    hasDocsToBeReviewed,
    user: userData,
    register,
    signout,
  }
}
