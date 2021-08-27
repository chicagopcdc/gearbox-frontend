import { useEffect, useState } from 'react'
import { getIn, useFormik } from 'formik'
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
  onRegister: (input: RegisterInput) => void
}

function RegisterForm({ docsToBeReviewed, onRegister }: RegisterFormProps) {
  const fieldsConfig: RegisterFormFieldConfig[] = [
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
      showIf: {
        name: 'role',
        value: 'other',
      },
    },
  ]

  const initialValues: RegisterInput = {
    firstName: '',
    lastName: '',
    institution: '',
    role: '',
    roleOther: '',
    reviewStatus: {},
  }

  for (const { id, name, formatted, required } of docsToBeReviewed) {
    fieldsConfig.push({
      type: 'checkbox',
      name: `reviewStatus.${id}`,
      label: (
        <>
          I have read and agree to the{' '}
          <LinkExternal className="underline text-primary" to={formatted}>
            {name}
          </LinkExternal>
        </>
      ),
      required,
    })

    initialValues.reviewStatus[id] = false
  }

  if (process.env.REACT_APP_ACCESS_CODE) {
    fieldsConfig.push({
      type: 'text',
      name: 'accessCode',
      label: 'Access code',
      required: true,
    })

    initialValues['accessCode'] = ''
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => () => setIsSubmitting(false), [])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: ({ role, roleOther, ...otherValues }) => {
      setIsSubmitting(true)

      if ('accessCode' in otherValues) delete otherValues['accessCode']
      onRegister({
        ...otherValues,
        role: role === 'other' && roleOther !== undefined ? roleOther : role,
      })
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {}

      if (
        process.env.REACT_APP_ACCESS_CODE &&
        process.env.REACT_APP_ACCESS_CODE !== values.accessCode
      )
        errors.accessCode = 'Invalid access code!'

      return errors
    },
  })

  function handleChange(e: any) {
    e.target.type === 'checkbox'
      ? formik.setFieldValue(e.target.name, e.target.checked)
      : formik.handleChange(e)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      {fieldsConfig.map(
        ({ showIf, ...fieldConfig }) =>
          (showIf === undefined ||
            getIn(formik.values, showIf.name) === showIf.value) && (
            <div className="my-4" key={fieldConfig.name}>
              <Field
                config={fieldConfig}
                value={getIn(formik.values, fieldConfig.name)}
                onChange={handleChange}
              />
              {fieldConfig.name === 'accessCode' &&
                formik.errors.accessCode && (
                  <div className="text-red-400 text-sm italic">
                    {formik.errors.accessCode}
                  </div>
                )}
            </div>
          )
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
