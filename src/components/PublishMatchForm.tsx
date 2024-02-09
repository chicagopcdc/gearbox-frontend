import Button from './Inputs/Button'
import { AlertCircle, Check, Loader } from 'react-feather'
import React, { useEffect, useRef, useState } from 'react'
import { ApiStatus } from '../model'
import { publishMatchForm } from '../utils'

export function PublishMatchForm() {
  const [publishDisabled, setPublishDisabled] = useState(false)
  const [publishStatus, setPublishStatus] = useState<ApiStatus>('not started')
  const timerIdRef = useRef<NodeJS.Timer | null>(null)
  const publish = () => {
    setPublishDisabled(true)
    setPublishStatus('sending')
    publishMatchForm()
      .then(() => {
        setPublishStatus('success')
        console.log('success')
      })
      .catch((err) => {
        setPublishStatus('error')
        console.error(err)
      })
      .finally(() => {
        setPublishDisabled(false)
        timerIdRef.current = setTimeout(
          () => setPublishStatus('not started'),
          3000
        )
      })
  }

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    }
  }, [])
  return (
    <div className="flex items-center">
      <Button disabled={publishDisabled} onClick={publish}>
        Publish
      </Button>
      {publishStatus === 'sending' ? (
        <Loader className="ml-4" />
      ) : publishStatus === 'success' ? (
        <h2 className="text-base text-green-600 ml-4 flex">
          <Check />
          Published Successfully
        </h2>
      ) : (
        publishStatus === 'error' && (
          <h2 className="text-base text-red-600 ml-4 flex">
            <AlertCircle className="mr-2" />
            Published Unsuccessfully
          </h2>
        )
      )}
    </div>
  )
}
