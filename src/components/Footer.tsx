import React from 'react'

import uchicagoBSDlogo from '../assets/uchicago-BSD-logo.jpg'
import pcdcLogo from '../assets/pcdc-logo.png'
import pedalLogo from '../assets/pedal-logo.svg'

function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-center lg:justify-between lg:text-left p-4 border-t border-solid border-primary">
      <a
        href="https://biologicalsciences.uchicago.edu/"
        className="m-2"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={uchicagoBSDlogo}
          alt="University of Chicago Biological Sciences Division logo"
          style={{ maxHeight: '80px' }}
        />
      </a>
      <a
        href="https://commons.cri.uchicago.edu/"
        className="m-2"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={pcdcLogo}
          alt="Pediatric Center Data Commons logo"
          style={{ maxHeight: '80px' }}
        />
      </a>
      <a
        href="https://www.lls.org/childrens-initiative/pedal"
        className="m-2"
        target="_blank"
        rel="noreferrer"
      >
        <img src={pedalLogo} alt="PedAL logo" style={{ maxHeight: '80px' }} />
      </a>
    </footer>
  )
}

export default Footer
