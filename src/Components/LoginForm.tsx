import React from 'react'
import { useFormik } from 'formik'
import Button from './Button'

const styles = {
  field: {
    wrapper: 'my-4 mx-8 text-center',
    label: 'mr-4',
    input: 'border border-solid border-black p-1',
  },
}

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.field.wrapper}>
        <label className={styles.field.label} htmlFor="username">
          Username
        </label>
        <input
          className={styles.field.input}
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
      </div>

      <div className={styles.field.wrapper}>
        <label className={styles.field.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.field.input}
          id="password"
          name="password"
          type="password"
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
