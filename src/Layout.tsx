import type React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics'

type LayoutProps = {
  children: React.ReactNode
  isAuthenticated: boolean
  isAdmin: boolean
  username: string
  onLogout: () => void
}

function Layout({
  children,
  isAuthenticated,
  isAdmin,
  username,
  onLogout,
}: LayoutProps) {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  useGoogleAnalytics()

  const isHomePage = location.pathname === '/'
  const isLoginPage = location.pathname === '/login'
  const isHomeLandingPage = isHomePage && !isAuthenticated
  const mainClassName = isHomeLandingPage
    ? ''
    : 'flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-12'
  const isHomeMatchingPage = isHomePage && isAuthenticated

  return (
    <>
      {isLoginPage || (
        <Header {...{ isAuthenticated, isAdmin, username, onLogout }} />
      )}
      <main className={mainClassName}>{children}</main>
      {isHomeMatchingPage || <Footer />}
    </>
  )
}

export default Layout
