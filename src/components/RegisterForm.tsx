import { useEffect, useState } from 'react'
import { getIn, useFormik } from 'formik'
import LinkExternal from './LinkExternal'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import type {
  RegisterFormFieldConfig,
  RegisterDocument,
  RegisterUserInput,
} from '../model'

export type RegisterFormProps = {
  docsToBeReviewed: RegisterDocument[]
  onRegister: (userInput: RegisterUserInput) => void
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

  const initialValues: RegisterUserInput = {
    firstName: '',
    lastName: '',
    institution: '',
    role: 'physician',
    roleOther: '',
    reviewStatus: {},
  }

  for (const { id, name, formatted } of docsToBeReviewed) {
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
    })

    initialValues.reviewStatus[id] = false
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => () => setIsSubmitting(false), [])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: ({ role, roleOther, ...userInput }) => {
      setIsSubmitting(true)
      onRegister({
        ...userInput,
        role: role === 'other' && roleOther !== undefined ? roleOther : role,
      })
    },
  })

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
                onChange={
                  fieldConfig.type === 'checkbox'
                    ? (e) =>
                        formik.setFieldValue(e.target.name, e.target.checked)
                    : formik.handleChange
                }
              />
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
