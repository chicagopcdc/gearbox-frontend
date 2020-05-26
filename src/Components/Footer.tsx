import React from 'react'
import pcdcLogo from '../assets/pcdc-logo.png'

const styles = {
  footerContent:
    'flex flex-wrap items-center justify-between border-t-2 border-solid border-black mx-4 py-4',
}

const ExtraFooter = () => (
  <div className={styles.footerContent}>
    <p>
      New to the Pediatric Cancer Data Commons? Visit our website for more
      details on GEARBOx.
    </p>
    <img src={pcdcLogo} alt="logo" style={{ height: '100px' }} />
  </div>
)

type FooterProps = {
  children: React.ReactNode
  showExtra: boolean
}

const Footer = ({ children, showExtra = false }: FooterProps) => {
  return (
    <>
      {showExtra && <ExtraFooter />}
      <div className={styles.footerContent}>{children}</div>
    </>
  )
}

export default Footer
