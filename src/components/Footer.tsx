import React from 'react'

import uchicagoBSDlogo from '../assets/uchicago-BSD-logo.jpg'
import volchenboumLabLogo from '../assets/volchenboum-lab-logo.png'
import pedalLogo from '../assets/pedal-logo.svg'

function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-center lg:justify-between lg:text-left p-4 border-t border-solid border-primary">
      <img
        src={uchicagoBSDlogo}
        alt="University of Chicago Biological Sciences Division logo"
        style={{ maxHeight: '80px' }}
      />
      <img
        src={volchenboumLabLogo}
        alt="Volchenboum Lab logo"
        style={{ maxHeight: '80px' }}
      />
      <img src={pedalLogo} alt="PedAL logo" style={{ maxHeight: '80px' }} />
    </footer>
  )
}

export default Footer
