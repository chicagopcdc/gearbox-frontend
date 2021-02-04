import React from 'react'
import Header, { HeaderProps } from './components/Header'
import Footer from './components/Footer'
import WarningBanner from './components/WarningBanner'

type LayoutProps = {
  children: React.ReactNode
  headerProps: HeaderProps
  hideHeader: boolean
  showExtraFooter: boolean
}

function Layout({
  children,
  headerProps,
  hideHeader,
  showExtraFooter,
}: LayoutProps) {
  return (
    <>
      <WarningBanner />
      {hideHeader || <Header {...headerProps} />}
      <main className="flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-12">
        {children}
      </main>
      <Footer showExtra={showExtraFooter} />
    </>
  )
}

export default Layout
