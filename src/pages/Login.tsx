import React from 'react'
import { useHistory } from 'react-router-dom'
import Box from '../components/Box'
import Button from '../components/Inputs/Button'
import LoginForm from '../components/LoginForm'
import GoogleLoginButton from '../components/GoogleLoginButton'
import { initFenceOAuth } from '../utils'
import gearboxLogo from '../assets/gearbox-logo.png'

const Login = ({
  authenticate,
}: {
  authenticate(username: string, cb?: () => void): void
}) => {
  const history = useHistory()
  const handleLogin = (values: { username: string; password?: string }) =>
    authenticate(values.username, () => history.replace('/'))

  return (
    <div className="flex flex-col h-full align-center justify-center max-w-md mx-auto">
      <img
        src={gearboxLogo}
        alt="GEARBOx logo"
        style={{ maxHeight: '150px' }}
      />

      <Box
        name="Login"
        innerClassName="flex flex-col justify-center text-center"
      >
        <div className="my-4">
          <GoogleLoginButton onClick={initFenceOAuth} />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-500 mx-4" />
          <span className="text-sm uppercase">or</span>
          <hr className="flex-1 border-gray-500 mx-4" />
        </div>

        <LoginForm onLogin={handleLogin} />
      </Box>
    </div>
  )
}

export default Login
