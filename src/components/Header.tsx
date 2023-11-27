import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'react-feather'
import LinkButton from './LinkButton'
import { UserActionButton, UserActionCard } from './UserAction'
import gearboxLogo from '../assets/gearbox-logo.svg'
import useScreenSize from '../hooks/useScreenSize'

type HeaderProps = {
  isAuthenticated: boolean
  isAdmin: boolean
  username: string
  onLogout: () => void
}

type NavItem = {
  name: string
  path: string
}

function Header({ isAuthenticated, isAdmin, username, onLogout }: HeaderProps) {
  const screenSize = useScreenSize()
  const [showUserAction, setShowUserAction] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const navItems: NavItem[] = [{ name: 'ABOUT GEARBOx', path: '/about' }]

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin' })
  }

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
            <div className="absolute bg-white border-t border-primary shadow-md pt-6 pb-4 text-center mt-10 w-full z-20">
              {navItems.map(({ path, name }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    isActive
                      ? 'hover:bg-red-100 text-xs text-center py-3 px-2 block w-full bg-red-100 font-bold text-secondary '
                      : 'hover:bg-red-100 text-xs text-center py-3 px-2 block w-full text-primary hover:text-secondary '
                  }
                  onClick={toggleMenu}
                >
                  {name}
                </NavLink>
              ))}
            </div>
          )}
          <NavLink
            to="/"
            className="absolute bg-white px-1 mt-3 z-30"
            style={{ left: 'calc(50vw - 64px)' }}
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
          <NavLink to="/" className="absolute bg-white px-1 mx-4 mt-2 z-30 ">
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
                className={({ isActive }) =>
                  isActive
                    ? 'text-xs text-center py-3 px-4 font-bold text-secondary'
                    : 'text-xs text-center py-3 px-4 text-primary hover:text-secondary '
                }
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
            className="z-30 mx-4 mt-3"
            isActive={showUserAction}
            onClick={toggleUserAction}
          />
          {showUserAction && (
            <UserActionCard
              className={`absolute z-20 ${
                screenSize.smAndDown
                  ? 'border-t border-primary mt-10 pt-6 w-full'
                  : 'border border-gray-300 min-w-[200px] mt-16 mx-4'
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
