import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Inputs/Button'

export type AuthbarProps = {
  isAuthenticated: boolean
  username: string
  signout: (cb?: () => void) => void
}

function Authbar({ isAuthenticated, username, signout }: AuthbarProps) {
  return (
    <div className="flex justify-end border-b border-solid border-primary">
      {isAuthenticated ? (
        <>
          {username !== '' && (
            <div className="flex items-center text-sm pr-4">
              Hello,&nbsp;<span className="font-bold">{username}</span>
            </div>
          )}
          <Button size="small" onClick={() => signout()}>
            Log out
          </Button>
        </>
      ) : (
        <Link style={{ lineHeight: '18px' }} to="/login">
          <Button size="small">Log in</Button>
        </Link>
      )}
    </div>
  )
}

export default Authbar
