import { useEffect, useMemo, useRef, useState } from 'react'
import { LoadingStatus, RegisterInput, UserData } from '../model'
import {
  fetchUser,
  keepUserSessionAlive,
  logout,
  registerUser,
  updateDocsReviewStatus,
} from '../api/auth'

export default function useAuth(): {
  isAuthenticated: boolean
  isRegistered: boolean
  hasDocsToBeReviewed: boolean
  user?: UserData
  loadingStatus: LoadingStatus
  register: (input: RegisterInput) => Promise<void>
  reviewDocuments: (status: RegisterInput['reviewStatus']) => Promise<void>
  signout: () => void
  fetchAuth: () => void
} {
  const [userData, setUserData] = useState<UserData>()
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatus>('not started')

  const fetchAuth = () => {
    setLoadingStatus('loading')
    fetchUser()
      .then((ud) => {
        setUserData(ud)
        setLoadingStatus('success')
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
  }

  const auth = useMemo(() => {
    const isAuthenticated = userData !== undefined
    const isRegistered =
      isAuthenticated && (userData.authz?.['/portal'] ?? [])?.length > 0
    const hasDocsToBeReviewed =
      isRegistered && (userData.docs_to_be_reviewed ?? [])?.length > 0
    return {
      isAuthenticated,
      isRegistered,
      hasDocsToBeReviewed,
      user: userData,
      register: (registerInput: RegisterInput) =>
        registerUser(registerInput).then(setUserData),
      reviewDocuments: (status: RegisterInput['reviewStatus']) =>
        updateDocsReviewStatus(status).then((docsToBeReviewed) =>
          setUserData((prevUserData) =>
            prevUserData === undefined
              ? prevUserData
              : { ...prevUserData, docs_to_be_reviewed: docsToBeReviewed }
          )
        ),
      signout: () => {
        localStorage.clear()
        setUserData(undefined)
        logout()
      },
      loadingStatus,
      fetchAuth,
    }
  }, [userData, loadingStatus])

  useEffect(() => {
    if (!auth.isAuthenticated) {
      fetchAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep access token alive
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (timer.current === undefined && auth.isAuthenticated)
      timer.current = window.setInterval(
        keepUserSessionAlive,
        10 * 60 * 1000 // ten minutes
      )

    return () => {
      if (timer.current !== undefined) window.clearInterval(timer.current)
    }
  }, [auth.isAuthenticated])

  return auth
}
