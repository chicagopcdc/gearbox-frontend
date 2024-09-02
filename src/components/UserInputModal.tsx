import React, { useRef } from 'react'
import { XCircle } from 'react-feather'
import Button from './Inputs/Button'

export function UserInputModal({
  closeModal,
  createMatchInput,
}: {
  closeModal: () => void
  createMatchInput: (name?: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function createUserInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const userInputName = inputRef.current?.value
    if (userInputName) {
      createMatchInput(userInputName)
    }
    closeModal()
  }

  return (
    <div
      id="user-input-modal"
      className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center z-50"
      style={{ background: '#cccc' }}
      role="dialog"
      aria-labelledby="user-input-dialog-title"
      aria-modal="true"
    >
      <div
        className="bg-white overflow-scroll w-full lg:w-3/4 xl:w-2/3 h-full"
        style={{ maxHeight: '30%', maxWidth: '40%' }}
      >
        <div className="text-sm sm:text-base px-4 pb-4 pt-2 sm:px-8 sm:pb-8">
          <div className="flex items-baseline justify-between border-b py-2 sm:py-4 mb-4 sticky top-0 bg-white">
            <h3 id="user-input-dialog-title" className="font-bold mr-4">
              Create New User Input
            </h3>
            <button
              className="ml-2 hover:text-red-700"
              onClick={closeModal}
              aria-label="Close User Input dialog"
            >
              <XCircle className="inline" />
            </button>
          </div>
          <form onSubmit={createUserInput}>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="userInputName">
                User Input Name:
              </label>
              <input type="text" id="userInputName" ref={inputRef} />
            </div>
            <Button type="submit" otherClassName="mt-4">
              Save
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
