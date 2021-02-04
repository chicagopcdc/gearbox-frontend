import React from 'react'
import Header, { HeaderProps } from './components/Header'
import Footer, { ExtraFooter } from './components/Footer'
import WarningBanner from './components/WarningBanner'

type LayoutProps = {
  headerProps: HeaderProps
  children: React.ReactNode
  hideHeader: boolean
  showExtraFooter: boolean
}

function Layout({
  headerProps,
  children,
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
      <footer>
        {showExtraFooter && <ExtraFooter />}
        <Footer />
      </footer>
    </>
  )
}

export default Layout
