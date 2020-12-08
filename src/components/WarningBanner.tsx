import React from 'react'
import WarningIcon from '../assets/warning-24px.svg'

function WarningBanner() {
  return (
    <div className="flex items-center justify-center bg-primary font-bold text-sm text-white p-2">
      <img className="mr-2" src={WarningIcon} alt="warning icon" /> This site is
      a prototype created for demo purposes only.
    </div>
  )
}

export default WarningBanner
