import type React from 'react'
import { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'

type MyRouteProps = {
  cb?(): void
  children: React.ReactNode
  isAuthenticated: boolean
  isPrivate?: boolean
  exact?: boolean
  path: string
}

const MyRoute = ({
  cb,
  children,
  isAuthenticated,
  isPrivate,
  ...rest
}: MyRouteProps) => {
  useEffect(() => {
    if (cb) cb()
  }, [cb])

  return (
    <Route
      {...rest}
      render={() =>
        isPrivate && !isAuthenticated ? (
          <Redirect to={{ pathname: '/login' }} />
        ) : (
          children
        )
      }
    />
  )
}

export default MyRoute
