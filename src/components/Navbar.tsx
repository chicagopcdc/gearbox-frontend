import React from 'react'
import { NavLink } from 'react-router-dom'

import gearboxLogo from '../assets/gearbox-logo.svg'

const navItems = [
  { name: 'Guide for Use', path: '/guide' },
  { name: 'Eligible Trials', path: '/trials' },
  { name: 'About GEARBOx', path: '/about' },
]

function Navbar() {
  return (
    <nav className="md:flex md:justify-between border-b border-solid border-gray-400">
      <div className="flex justify-center">
        <NavLink to="/">
          <img
            src={gearboxLogo}
            alt="GEARBOx logo"
            className="px-4 py-2"
            style={{ maxHeight: '100px' }}
          />
        </NavLink>
      </div>

      <div className="flex md:justify-end text-sm text-center uppercase">
        {navItems.map(({ path, name }) => (
          <NavLink
            key={path}
            to={path}
            className="flex flex-1 md:flex-initial items-center justify-center hover:bg-gray-400 p-4 border-l border-solid border-gray-400"
            activeClassName="bg-gray-700 hover:bg-gray-600 text-white"
          >
            {name}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
