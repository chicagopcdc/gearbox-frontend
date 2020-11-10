import React from 'react'
import Authbar, { AuthbarProps } from './components/Authbar'
import Navbar from './components/Navbar'
import Footer, { ExtraFooter } from './components/Footer'

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
      {hideHeader || (
        <header>
          <Authbar {...authbarProps} />
          <Navbar />
        </header>
      )}
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
