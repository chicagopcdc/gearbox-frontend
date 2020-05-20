import React from 'react'
import './Navbar.css'

type NavbarProps = {
  logo: React.ReactElement
  items: React.ReactElement[]
}

const Navbar = ({ logo, items }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">{logo}</div>
      <ul className="navbar__items">
        {items.map((item) => (
          <li className="navbar__item">{item}</li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
