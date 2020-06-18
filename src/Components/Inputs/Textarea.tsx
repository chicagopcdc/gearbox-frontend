import React from 'react'
import Label from './Label'

const styles = {
  label: 'mr-4',
  input: 'border border-solid border-black p-1 block w-full',
}

type TextareaProps = {
  label?: string
  name?: string
  disabled?: boolean
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  value?: string | number
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

const Textarea = ({ label = '', name = '', ...attrs }: TextareaProps) => {
  return (
    <>
      {label && <Label className={styles.label} text={label} htmlFor={name} />}
      <textarea
        {...attrs}
        className={styles.input}
        id={name}
        name={name}
        style={{
          minHeight: '100px',
          resize: 'none',
        }}
      />
    </>
  )
}

export default Textarea
