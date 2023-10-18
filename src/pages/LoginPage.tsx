import './LoginPage.css'
import gearboxLogo from '../assets/gearbox-logo.svg'
import { loginWithGoogle } from '../api/auth'

function LoginPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="border border-gray border-solid px-4 sm:px-8 pt-12 pb-20 sm:pb-28">
        <div className="flex justify-center mb-4">
          <img
            src={gearboxLogo}
            alt="GEARBOx logo"
            style={{ height: '40px' }}
          />
        </div>
        <h1 className="mb-16 text-lg text-center">Log in to your account</h1>

        <div className="mb-4 flex justify-center">
          <button
            className="bg-cover bg-no-repeat border-0"
            id="google-login-btn"
            onClick={loginWithGoogle}
          ></button>
        </div>
        <p className="text-sm">
          If this is your first time, you will be asked to register.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
