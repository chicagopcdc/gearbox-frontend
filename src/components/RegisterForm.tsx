import { useEffect, useState } from 'react'
import LinkExternal from './LinkExternal'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import type {
  RegisterFormFieldConfig,
  RegisterDocument,
  RegisterInput,
} from '../model'

export type RegisterFormProps = {
  docsToBeReviewed: RegisterDocument[]
  onRegister: (input: RegisterInput) => Promise<void>
}

type RegisterUserInput = Omit<RegisterInput, 'reviewStatus' | 'accessCde'>

function RegisterForm({ docsToBeReviewed, onRegister }: RegisterFormProps) {
  const [error, setError] = useState(null as Error | null)
  if (error) throw error

  const userFieldsConfig: RegisterFormFieldConfig[] = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First name',
      required: true,
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last name',
      required: true,
    },
    {
      type: 'text',
      name: 'institution',
      label: 'Institution',
      required: true,
    },
    {
      type: 'select',
      name: 'role',
      label: 'Role',
      required: true,
      placeholder: 'Select your role...',
      options: [
        {
          value: 'physician',
          label: 'Physician',
        },
        {
          value: 'physician-assistant',
          label: 'Physician Assistant',
        },
        {
          value: 'nurse',
          label: 'Nurse',
        },
        {
          value: 'research-assistant',
          label: 'Research Assistant',
        },
        {
          value: 'other',
          label: 'Other',
        },
      ],
    },
    {
      type: 'text',
      name: 'roleOther',
      label: 'Type in your role',
      required: true,
    },
  ]
  const initialUser: RegisterUserInput = {
    firstName: '',
    lastName: '',
    institution: '',
    role: '',
    roleOther: '',
  }
  const [showRoleOther, setShowRoleOther] = useState(false)
  function handleUserChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'role') setShowRoleOther(e.target.value === 'other')
  }

  const reviewStatusFieldsConfig: RegisterFormFieldConfig[] = []
  const initialReviewStatus: RegisterInput['reviewStatus'] = {}
  for (const { id, name, formatted, required, version } of docsToBeReviewed) {
    reviewStatusFieldsConfig.push({
      type: 'checkbox',
      name: `reviewStatus.${id}`,
      label: (
        <>
          I have read and agree to the{' '}
          <LinkExternal className="underline text-primary" to={formatted}>
            {name}
          </LinkExternal>
          {version ? ` (v${version})` : null}
        </>
      ),
      required,
    })

    initialReviewStatus[id] = false
  }

  let accessCodeFieldConfig: RegisterFormFieldConfig | undefined = undefined
  if (process.env.REACT_APP_ACCESS_CODE)
    accessCodeFieldConfig = {
      type: 'text',
      name: 'accessCode',
      label: 'Access code',
      required: true,
      pattern: process.env.REACT_APP_ACCESS_CODE,
    }
  const [accessCode, setAccessCode] = useState('')
  function handleAccessCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAccessCode(e.target.value)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => () => setIsSubmitting(false), [])
  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    const user = { ...initialUser }
    const reviewStatus = { ...initialReviewStatus }
    const formData = new FormData(e.target as HTMLFormElement)
    for (const [k, v] of formData.entries())
      if (k !== 'accessCode')
        if (k.startsWith('reviewStatus')) {
          const id = Number(k.split('.')[1])
          reviewStatus[id] = v === 'on'
        } else {
          user[k as keyof RegisterUserInput] = v as string
        }

    setIsSubmitting(true)
    const { role, roleOther, ...rest } = user
    onRegister({
      reviewStatus,
      role: role === 'other' && roleOther !== undefined ? roleOther : role,
      ...rest,
    }).catch(setError)
  }

  return (
    <form onSubmit={handleSubmit}>
      {userFieldsConfig.map(
        (fieldConfig) =>
          (fieldConfig.name !== 'roleOther' || showRoleOther) && (
            <div className="my-4" key={fieldConfig.name}>
              <Field config={fieldConfig} onChange={handleUserChange} />
            </div>
          )
      )}
      {reviewStatusFieldsConfig.map((fieldConfig) => (
        <div className="my-4" key={fieldConfig.name}>
          <Field config={fieldConfig} />
        </div>
      ))}
      {accessCodeFieldConfig !== undefined && (
        <div className="my-4" key={accessCodeFieldConfig.name}>
          <Field
            config={accessCodeFieldConfig}
            value={accessCode}
            onChange={handleAccessCodeChange}
          />
          {accessCode !== '' &&
            accessCode !== accessCodeFieldConfig.pattern && (
              <div className="text-red-400 text-sm italic">
                Invalid access code!
              </div>
            )}
        </div>
      )}
      <div className="flex flex-wrap justify-center mt-8">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </div>
    </form>
  )
}

export default RegisterForm
