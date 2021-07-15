import Button from './Inputs/Button'
import googleLogo from '../assets/google-logo.svg'

function handleGoogleLogin() {
  window.location.assign(`/user/login/google?redirect=${window.location.href}`)
}

function GoogleLoginButton() {
  return (
    <Button block outline onClick={handleGoogleLogin}>
      <img src={googleLogo} alt="Google G logo" className="h-6 inline -mt-1" />
      <span className="pl-2">Continue with Google</span>
    </Button>
  )
}

export default GoogleLoginButton
