import React from 'react'
import { useFormik } from 'formik'
import Button from './Inputs/Button'
import TextField from './Inputs/TextField'

const styles = {
  field: 'my-4 mx-8 text-center',
}

type LoginFormProps = {
  onLogin: (values: { username: string; password: string }) => void
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: onLogin,
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.field}>
        <TextField
          label="Username"
          name="username"
          required
          onChange={formik.handleChange}
          value={formik.values.username}
        />
      </div>

      <div className={styles.field}>
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </div>

      <div className="text-center">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}

export default LoginForm
