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
  const isLoginPage = location.pathname === '/login'
  return (
    <>
      <WarningBanner />
      {isLoginPage || <Header {...headerProps} />}
      <main className="flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-12">
        {children}
      </main>
      <Footer showExtra={isLoginPage} />
    </>
  )
}

export default Layout
