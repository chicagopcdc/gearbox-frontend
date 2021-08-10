import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'react-feather'
import LinkButton from './LinkButton'
import { UserActionButton, UserActionCard } from './UserAction'
import gearboxLogo from '../assets/gearbox-logo.svg'
import useScreenSize from '../hooks/useScreenSize'

const navItems = [
  { name: 'ABOUT GEARBOx', path: '/about' },
  { name: 'USER GUIDE', path: '/guide' },
]

export type HeaderProps = {
  isAuthenticated: boolean
  username: string
  onLogout: () => void
}

function Header({ isAuthenticated, username, onLogout }: HeaderProps) {
  const screenSize = useScreenSize()
  const [showUserAction, setShowUserAction] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  function toggleUserAction() {
    setShowUserAction(!showUserAction)
    setShowMenu(false)
  }
  function toggleMenu() {
    setShowMenu(!showMenu)
    setShowUserAction(false)
  }

  return (
    <header className="flex justify-between border-b border-solid border-primary">
      {screenSize.smAndDown ? (
        <nav style={{ minHeight: '40px' }}>
          <button
            className="flex items-center absolute text-primary text-sm p-2"
            onClick={toggleMenu}
          >
            {showMenu ? <X /> : <Menu />}
            <span className="mx-2">Menu</span>
          </button>
          {showMenu && (
            <div className="absolute bg-white border-t border-primary shadow-md pt-6 pb-4 text-center mt-10 w-full z-10">
              {navItems.map(({ path, name }) => (
                <NavLink
                  key={path}
                  to={path}
                  className="hover:bg-red-100 text-xs text-primary hover:text-secondary text-center py-3 px-2 block w-full"
                  activeClassName="font-bold text-secondary bg-red-100"
                  onClick={toggleMenu}
                >
                  {name}
                </NavLink>
              ))}
            </div>
          )}
          <NavLink
            to="/"
            className="absolute bg-white px-1 mt-3 z-20"
            style={{ left: 'calc(50vw - 72px)' }}
            onClick={showMenu ? toggleMenu : undefined}
          >
            <img
              src={gearboxLogo}
              alt="GEARBOx logo"
              style={{ maxHeight: '40px' }}
            />
          </NavLink>
        </nav>
      ) : (
        <nav>
          <NavLink to="/" className="absolute bg-white px-1 mx-4 mt-2 z-20 ">
            <img
              src={gearboxLogo}
              alt="GEARBOx logo"
              style={{ maxHeight: '48px' }}
            />
          </NavLink>
          <div className="flex" style={{ marginLeft: '180px' }}>
            {navItems.map(({ path, name }) => (
              <NavLink
                key={path}
                to={path}
                className="text-xs text-primary hover:text-secondary text-center py-3 px-4"
                activeClassName="font-bold text-secondary"
              >
                {name}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
      {isAuthenticated ? (
        <div className="flex justify-end">
          <UserActionButton
            className="z-20 mx-4 mt-3"
            isActive={showUserAction}
            onClick={toggleUserAction}
          />
          {showUserAction && (
            <UserActionCard
              className={`absolute z-10 ${
                screenSize.smAndDown
                  ? 'border-t border-primary mt-10 pt-6 w-full'
                  : 'border border-gray-300 mt-16 mx-4'
              }`}
              username={username}
              onLogout={onLogout}
            />
          )}
        </div>
      ) : (
        <LinkButton to="/login" size="small">
          Log in
        </LinkButton>
      )}
    </header>
  )
}

export default Header
