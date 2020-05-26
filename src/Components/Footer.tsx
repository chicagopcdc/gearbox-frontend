import React from 'react'

import pcdcLogo from '../assets/pcdc-logo.png'
import uchicagoBSDlogo from '../assets/uchicago-BSD-logo.jpg'
import volchenboumLabLogo from '../assets/volchenboum-lab-logo.png'
import pedalLogo from '../assets/pedal-logo.png'

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

const Footer = ({ showExtra = false }) => {
  return (
    <>
      {showExtra && <ExtraFooter />}
      <div className={styles.footerContent}>
        <img src={uchicagoBSDlogo} alt="logo" style={{ height: '100px' }} />
        <img src={volchenboumLabLogo} alt="logo" style={{ height: '100px' }} />
        <img src={pedalLogo} alt="logo" style={{ height: '100px' }} />
      </div>
    </>
  )
}

export default Footer
