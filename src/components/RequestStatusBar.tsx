import { ApiStatus } from '../model'
import { AlertCircle, Check, Loader } from 'react-feather'
import React from 'react'

export function RequestStatusBar({
  loadingStatus,
  errorMsg,
}: {
  loadingStatus: ApiStatus
  errorMsg: string
}) {
  if (loadingStatus === 'sending') {
    return <Loader className="mr-4" />
  } else if (loadingStatus === 'success') {
    return (
      <h2 className="text-base text-green-600 mr-4 flex">
        <Check />
        OK!
      </h2>
    )
  } else if (loadingStatus === 'error') {
    return (
      <h2 className="text-base text-red-600 mr-4 flex">
        <AlertCircle className="mr-2" />
        {errorMsg}
      </h2>
    )
  }
  return null
}
