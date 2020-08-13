import React, { useState } from 'react'
import Button from './Inputs/Button'
import TextField from './Inputs/TextField'

const styles = {
  field: 'my-4 mx-8 sm:ml-0 sm:mr-12 sm:text-right',
}

type LoginFormProps = {
  onLogin: (values: { username: string; password?: string }) => void
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onLogin({ username, password })
      }}
    >
      <div className={styles.field}>
        <TextField
          label="Username"
          name="username"
          autoFocus
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>

      <div className={styles.field}>
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}

export default LoginForm
