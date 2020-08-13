import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import Button from './Inputs/Button'

import gearboxLogo from '../assets/gearbox-logo.png'

const styles = {
  authbar: 'flex justify-end pt-2 mx-4 px-4',
  navbar:
    'md:flex md:flex-wrap md:items-center md:justify-between border-b-2 border-solid border-black mx-4 px-4 mb-4',
  navbarLogo: 'flex justify-center md:justify-start md:flex-1',
  navbarItems:
    'text-center flex items-center justify-between md:flex-1 md:justify-end',
  navbarItem: 'list-none hover:text-red-500 p-4',
}

const navItems = [
  { name: 'Guide for Use', path: '/guide' },
  { name: 'Eligible Trials', path: '/trials' },
  { name: 'About GEARBOx', path: '/about' },
]

type NavbarProps = {
  isAuthenticated: boolean
  username: string
  signout: (cb?: () => void) => void
}

const Navbar = ({ isAuthenticated, username, signout }: NavbarProps) => (
  <>
    <div className={styles.authbar}>
      {isAuthenticated ? (
        <>
          {username !== '' && (
            <div className="flex items-center text-sm pr-4">
              Hello,&nbsp;<span className="font-bold">{username}</span>
            </div>
          )}
          <Button small onClick={() => signout()}>
            Logout
          </Button>
        </>
      ) : (
        <Link to="/login">
          <Button small>Login</Button>
        </Link>
      )}
    </div>

    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <NavLink to="/">
          <img
            src={gearboxLogo}
            alt="GEARBOx logo"
            style={{ maxHeight: '100px' }}
          />
        </NavLink>
      </div>

      <ul className={styles.navbarItems}>
        {navItems.map(({ path, name }) => (
          <li className={styles.navbarItem} key={path}>
            <NavLink to={path} activeClassName="text-red-500">
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </>
)

export default Navbar
