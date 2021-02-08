import React from 'react'
import { useLocation } from 'react-router-dom'
import Header, { HeaderProps } from './components/Header'
import Footer from './components/Footer'
import WarningBanner from './components/WarningBanner'

type LayoutProps = {
  children: React.ReactNode
  headerProps: HeaderProps
}

function Layout({ children, headerProps }: LayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isLoginPage = location.pathname === '/login'
  const isHomeLandingPage = isHomePage && !headerProps.isAuthenticated
  const mainClassName = isHomeLandingPage
    ? ''
    : 'flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-12'

  return (
    <>
      <WarningBanner />
      {isLoginPage || <Header {...headerProps} />}
      <main className={mainClassName}>{children}</main>
      <Footer showExtra={isLoginPage} />
    </>
  )
}

export default Layout
