import React from 'react'
import { useGoogleLogin, GoogleLoginResponse } from 'react-google-login'
import Button from './Inputs/Button'
import googleLogo from '../assets/google-logo.svg'

type GoogleLoginButtonProps = {
  onLogin(values: { username: string }): void
}

const GoogleLoginButton = ({ onLogin }: GoogleLoginButtonProps) => {
  const { signIn } = useGoogleLogin({
    onSuccess: (res) => {
      onLogin({ username: (res as GoogleLoginResponse).profileObj.email })
    },
    onFailure: (error) => {
      console.log(error)
    },
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
    isSignedIn: true,
  })

  return (
    <Button onClick={signIn}>
      <img src={googleLogo} alt="Google G logo" className="h-6 inline -mt-1" />
      <span className="pl-4">Continue with Google</span>
    </Button>
  )
}

export default GoogleLoginButton
