import { useState } from 'react'
import Button from './Inputs/Button'
import TextField from './Inputs/TextField'

type LoginFormProps = {
  onLogin: (values: { username: string; password?: string }) => void
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      className="mx-12"
      onSubmit={(e) => {
        e.preventDefault()
        onLogin({ username, password })
      }}
    >
      <div className="mb-4">
        <TextField
          label="Username"
          name="username"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>

      <div className="mb-8">
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <Button block type="submit">
        Submit
      </Button>
    </form>
  )
}

export default LoginForm
