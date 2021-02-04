import React from 'react'
import Header from './components/Header'
import { AuthbarProps } from './components/Authbar'
import Footer, { ExtraFooter } from './components/Footer'
import WarningBanner from './components/WarningBanner'

type LayoutProps = {
  authbarProps: AuthbarProps
  children: React.ReactNode
  hideHeader: boolean
  showExtraFooter: boolean
}

function Layout({
  authbarProps,
  children,
  hideHeader,
  showExtraFooter,
}: LayoutProps) {
  return (
    <>
      <WarningBanner />
      {hideHeader || <Header {...authbarProps} />}
      <main className="flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-12">
        {children}
      </main>
      <footer>
        {showExtraFooter && <ExtraFooter />}
        <Footer />
      </footer>
    </>
  )
}

export default Layout
