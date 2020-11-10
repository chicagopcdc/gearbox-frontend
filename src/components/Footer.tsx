import React from 'react'

import pcdcLogo from '../assets/pcdc-logo.png'
import uchicagoBSDlogo from '../assets/uchicago-BSD-logo.jpg'
import volchenboumLabLogo from '../assets/volchenboum-lab-logo.png'
import pedalLogo from '../assets/pedal-logo.png'

const baseFooterClassName =
  'flex flex-wrap items-center justify-center lg:justify-between lg:text-left p-4'
const extraFooterClassName = `${baseFooterClassName} bg-primary text-center text-white`
const footerClassName = `${baseFooterClassName} border-t border-solid border-primary`

export function ExtraFooter() {
  return (
    <div className={extraFooterClassName}>
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
}

export default function Footer() {
  return (
    <div className={footerClassName}>
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
  )
}
