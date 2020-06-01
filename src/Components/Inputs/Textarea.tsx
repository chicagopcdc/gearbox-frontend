import React from 'react'
import Label from './Label'

const styles = {
  label: 'mr-4',
  input: 'border border-solid border-black p-1 block',
}

type TextareaProps = {
  label?: string
  name?: string
  disabled?: boolean
  placeholder?: string
  readonly?: boolean
  required?: boolean
  value?: string | number
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

const Textarea = ({
  label = '',
  name = '',
  disabled,
  placeholder,
  readonly,
  required,
  value,
  onChange,
}: TextareaProps) => {
  return (
    <>
      {label && <Label className={styles.label} text={label} htmlFor={name} />}
      <textarea
        className={styles.input}
        id={name}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        readOnly={readonly}
        required={required}
        value={value}
        onChange={onChange}
      />
    </>
  )
}

export default Textarea
