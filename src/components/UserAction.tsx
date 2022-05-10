import { Link } from 'react-router-dom'
import { User } from 'react-feather'
import Button from './Inputs/Button'
import LinkExternal from './LinkExternal'

function joinClassNames(...args: string[]) {
  return args.filter(Boolean).join(' ')
}

type UserActionButtonProps = {
  className?: string
  isActive: boolean
  onClick(): void
}

export function UserActionButton({
  className = '',
  isActive,
  onClick,
}: UserActionButtonProps) {
  return (
    <button
      className={joinClassNames(
        'absolute bg-primary hover:bg-secondary text-white rounded-full h-10 w-10 flex items-center justify-center',
        isActive ? 'ring-4 ring-red-100' : '',
        className
      )}
      aria-label="User action"
      onClick={onClick}
    >
      <User />
    </button>
  )
}

type UserActionCardProps = {
  className?: string
  username: string
  onLogout: () => void
}

export function UserActionCard({
  className = '',
  username,
  onLogout,
}: UserActionCardProps) {
  return (
    <div
      className={joinClassNames(
        'bg-white shadow-md px-8 py-4 text-center',
        className
      )}
    >
      <div className="mb-2">Hello,</div>
      <div className="text-sm mb-8">{username}</div>
      <Button outline onClick={onLogout}>
        Log out
      </Button>
      <ul className="text-sm mt-8 mb-4 min-w-max">
        <li className="mx-2 inline underline">
          <Link to="/terms">Terms</Link>
        </li>
        •
        <li className="mx-2 inline underline">
          <LinkExternal to="https://commons.cri.uchicago.edu/wp-content/uploads/2021/04/PCDC-Privacy-Notice.pdf">
            Privacy Notice
          </LinkExternal>
        </li>
      </ul>
      <p className="italic text-xs">
        UI version: {process.env.REACT_APP_VERSION}
      </p>
    </div>
  )
}
