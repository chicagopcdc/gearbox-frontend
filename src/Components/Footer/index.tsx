import React from 'react'
import './Footer.css'

const Footer = ({ children }: { children: React.ReactNode }) => {
  return (
    <footer className="footer">
      <div className="footer__content">{children}</div>
    </footer>
  )
}

export default Footer
