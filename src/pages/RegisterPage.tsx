import { useState } from 'react'
import RegisterForm from '../components/RegisterForm'
import gearboxLogo from '../assets/gearbox-logo.svg'
import { registerUser } from '../utils'
import type { RegisterDocument, RegisterUserInput } from '../model'

type RegisterPageProps = {
  docsToBeReviewed: RegisterDocument[]
  onRegister: () => void
}

function RegisterPage({ docsToBeReviewed, onRegister }: RegisterPageProps) {
  const [isError, setIsError] = useState(false)

  function handleRegister(userInput: RegisterUserInput) {
    registerUser(userInput)
      .then(onRegister)
      .catch((e) => {
        setIsError(true)
        console.error(e)
      })
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="border border-gray border-solid px-4 sm:px-8 pt-12 pb-16"
        style={{ width: 'calc(400px + 4rem)' }}
      >
        <div className="flex justify-center mb-4">
          <img
            src={gearboxLogo}
            alt="GEARBOx logo"
            style={{ height: '40px' }}
          />
        </div>

        {isError ? (
          <>
            <h1 className="mb-16 text-lg text-center">
              Failed to register to use GEARBOx!
            </h1>
            <p>
              Pleaset refresh thie page and try again. If the problem persists,
              please contact us to get help.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-16 text-lg text-center">
              Register to use GEARBOx
            </h1>
            <RegisterForm
              docsToBeReviewed={docsToBeReviewed}
              onRegister={handleRegister}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
