import React from 'react'
import './Footer.css'

const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="footer__content">{children}</div>
}

export default Footer
