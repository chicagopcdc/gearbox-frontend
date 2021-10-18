import Button from './Inputs/Button'
import { loginWithGoogle } from '../api/auth'
import googleLogo from '../assets/google-logo.svg'

function GoogleLoginButton() {
  return (
    <Button block outline onClick={loginWithGoogle}>
      <img src={googleLogo} alt="Google G logo" className="h-6 inline -mt-1" />
      <span className="pl-2">Continue with Google</span>
    </Button>
  )
}

export default GoogleLoginButton
