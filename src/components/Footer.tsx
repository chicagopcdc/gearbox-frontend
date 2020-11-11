import React from 'react'

import pcdcLogo from '../assets/pcdc-logo.png'
import uchicagoBSDlogo from '../assets/uchicago-BSD-logo.jpg'
import volchenboumLabLogo from '../assets/volchenboum-lab-logo.png'
import pedalLogo from '../assets/pedal-logo.svg'

const baseClassName =
  'flex flex-wrap items-center justify-center lg:justify-between lg:text-left p-4'

export function ExtraFooter() {
  return (
    <div className={`${baseClassName} bg-primary text-center text-white`}>
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
    <div className={`${baseClassName} border-t border-solid border-primary`}>
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
