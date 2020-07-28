import React from 'react'
import { useHistory } from 'react-router-dom'

import Box from '../components/Box'
import Button from '../components/Inputs/Button'
import LoginForm from '../components/LoginForm'

import gearboxLogo from '../assets/gearbox-logo.png'

const Login = ({
  authenticate,
}: {
  authenticate(username: string, cb?: () => void): void
}) => {
  const history = useHistory()

  const handleLogin = (values: {
    username: string
    password: string
  }): void => {
    if (process.env.NODE_ENV === 'development') {
      alert(JSON.stringify(values, null, 2))
    }

    authenticate(values.username, () => history.replace('/'))
  }

  return (
    <div className="flex flex-col h-full align-center justify-center max-w-md mx-auto">
      <img
        src={gearboxLogo}
        alt="GEARBOx logo"
        style={{ maxHeight: '150px' }}
      />

      <Box name="Login">
        <LoginForm onLogin={handleLogin} />
      </Box>

      <div className="flex justify-around">
        <Button onClick={() => alert('add user')}>Add User</Button>
        <Button onClick={() => alert('add institution')}>
          Add Institution
        </Button>
      </div>
    </div>
  )
}

export default Login
