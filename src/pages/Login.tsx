import GoogleLoginButton from '../components/GoogleLoginButton'
import { initFenceOAuth } from '../utils'
import gearboxLogo from '../assets/gearbox-logo.svg'

function Login() {
  return (
    <div className="flex flex-col h-full align-center justify-center max-w-sm mx-auto">
      <img src={gearboxLogo} alt="GEARBOx logo" className="mb-12" />

      <div className="mb-4 mx-12">
        <GoogleLoginButton onClick={initFenceOAuth} />
      </div>
    </div>
  )
}

export default Login
