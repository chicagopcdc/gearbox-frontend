import React from 'react'
import Box from '../Components/Box'
import Button from '../Components/Inputs/Button'
import LoginForm from '../Components/LoginForm'

import gearboxLogo from '../assets/gearbox-logo.png'

const Login = ({ onLogin }: { onLogin(cb: () => void): void }) => {
  return (
    <div className="flex flex-col h-full align-center">
      <div className="m-auto flex-col align-center justify-center">
        <img src={gearboxLogo} alt="logo" style={{ height: '150px' }} />

        <Box name="Login">
          <LoginForm onLogin={onLogin} />
        </Box>

        <div className="flex justify-around">
          <Button onclick={() => alert('add user')}>Add User</Button>
          <Button onclick={() => alert('add institution')}>
            Add Institution
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
