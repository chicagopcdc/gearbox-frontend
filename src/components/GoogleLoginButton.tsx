import React from 'react'
import Button from './Inputs/Button'
import googleLogo from '../assets/google-logo.svg'

type GoogleLoginButtonProps = {
  onClick(): void
}

const GoogleLoginButton = ({ onClick }: GoogleLoginButtonProps) => (
  <Button block outline onClick={onClick}>
    <img src={googleLogo} alt="Google G logo" className="h-6 inline -mt-1" />
    <span className="pl-4">Continue with Google</span>
  </Button>
)

export default GoogleLoginButton
