import React from 'react'
import { useFormik } from 'formik'
import Button from './Inputs/Button'
import TextField from './Inputs/TextField'
import GoogleLoginButton from './GoogleLoginButton'

const styles = {
  field: 'my-4 mx-8 sm:ml-0 sm:mr-12 sm:text-right',
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
    <div className="flex flex-col justify-center text-center">
      <div className="my-4">
        <GoogleLoginButton />
      </div>

      <div className="flex items-center my-4">
        <hr className="flex-1 border-gray-500 mx-4" />
        <span className="text-sm uppercase">or</span>
        <hr className="flex-1 border-gray-500 mx-4" />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className={styles.field}>
          <TextField
            label="Username"
            name="username"
            autoFocus
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

        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default LoginForm
