import { useHistory } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import GoogleLoginButton from '../components/GoogleLoginButton'
import { initFenceOAuth } from '../utils'
import gearboxLogo from '../assets/gearbox-logo.svg'

type LoginProps = {
  authenticate(username: string, cb?: () => void): void
}

function Login({ authenticate }: LoginProps) {
  const history = useHistory()
  function handleLogin(values: { username: string; password?: string }) {
    authenticate(values.username, () => history.replace('/'))
  }

  return (
    <div className="flex flex-col h-full align-center justify-center max-w-sm mx-auto">
      <img src={gearboxLogo} alt="GEARBOx logo" className="mb-12" />

      <LoginForm onLogin={handleLogin} />

      <div className="flex items-center my-4 mx-12">
        <hr className="flex-1 border-gray-500 mr-4" />
        <span className="text-sm uppercase">or</span>
        <hr className="flex-1 border-gray-500 ml-4" />
      </div>

      <div className="mb-4 mx-12">
        <GoogleLoginButton onClick={initFenceOAuth} />
      </div>
    </div>
  )
}

export default Login
