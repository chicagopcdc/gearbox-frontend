import React from 'react'

import pcdcLogo from '../assets/pcdc-logo.png'
import uchicagoBSDlogo from '../assets/uchicago-BSD-logo.jpg'
import volchenboumLabLogo from '../assets/volchenboum-lab-logo.png'
import pedalLogo from '../assets/pedal-logo.png'

const styles = {
  footerContent:
    'flex flex-wrap items-center justify-center lg:justify-between text-center lg:text-left border-t-2 border-solid border-black mx-4 py-4',
}

const ExtraFooter = () => (
  <div className={styles.footerContent}>
    <p>
      New to the Pediatric Cancer Data Commons? Visit our website for more
      details on GEARBOx.
    </p>
    <img
      src={pcdcLogo}
      alt="Pediatric Center Data Commons logo"
      style={{ maxHeight: '100px' }}
    />
  </div>
)

const Footer = ({ showExtra = false }) => {
  return (
    <>
      {showExtra && <ExtraFooter />}
      <div className={styles.footerContent}>
        <img
          src={uchicagoBSDlogo}
          alt="University of Chicago Biological Sciences Division logo"
          style={{ maxHeight: '100px' }}
        />
        <img
          src={volchenboumLabLogo}
          alt="Volchenboum Lab logo"
          style={{ maxHeight: '100px' }}
        />
        <img src={pedalLogo} alt="PedAL logo" style={{ maxHeight: '100px' }} />
      </div>
    </>
  )
}

export default Footer
