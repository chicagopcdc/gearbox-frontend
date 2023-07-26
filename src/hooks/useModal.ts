import { useEffect, useState } from 'react'

export function useModal(): [boolean, () => void, () => void] {
  const [showModal, setShowModal] = useState(false)

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  useEffect(closeModal, [])

  useEffect(() => {
    function closeModalOnEscape(e: KeyboardEvent) {
      if (showModal && e.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', closeModalOnEscape)

    return () => {
      window.removeEventListener('keydown', closeModalOnEscape)
    }
  }, [showModal])

  return [showModal, openModal, closeModal]
}
