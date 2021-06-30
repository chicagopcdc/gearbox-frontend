import { NavLink } from 'react-router-dom'
import Button from './Inputs/Button'
import LinkButton from './LinkButton'
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
  const authElement = (
    <div className="flex justify-end mb-2 md:mb-0">
      {isAuthenticated ? (
        <>
          {username !== '' && (
            <div className="flex items-center text-sm pr-4">
              Hello,&nbsp;<span className="font-bold">{username}</span>
            </div>
          )}
          <Button size="small" onClick={onLogout}>
            Log out
          </Button>
        </>
      ) : (
        <LinkButton to="/login" size="small">
          Log in
        </LinkButton>
      )}
    </div>
  )

  return (
    <header>
      <div className="flex-row md:flex justify-between border-b border-solid border-primary">
        {screenSize.smAndDown && authElement}
        <nav className="flex justify-between">
          <div>
            <NavLink
              to="/"
              className={`absolute bg-white px-1 mx-4 ${
                screenSize.current === '2xs' ? 'mt-6' : 'mt-2'
              }`}
            >
              <img
                src={gearboxLogo}
                alt="GEARBOx logo"
                style={{ maxHeight: '48px' }}
              />
            </NavLink>
          </div>
          <div className="flex" style={{ marginLeft: '180px' }}>
            {navItems.map(({ path, name }) => (
              <NavLink
                key={path}
                to={path}
                className="text-xs text-primary hover:text-secondary text-center py-3 px-2 md:px-4"
                activeClassName="font-bold text-secondary"
              >
                {name}
              </NavLink>
            ))}
          </div>
        </nav>
        {screenSize.mdAndUp && authElement}
      </div>
    </header>
  )
}

export default Header
