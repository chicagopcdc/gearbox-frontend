import { useState } from 'react'
import DocumentReviewForm from '../components/DocumentReviewForm'
import gearboxLogo from '../assets/gearbox-logo.svg'
import type { RegisterDocument, RegisterInput } from '../model'

type DocumentReviewPageProps = {
  docsToBeReviewed: RegisterDocument[]
  onReview: (reviewStatus: RegisterInput['reviewStatus']) => Promise<void>
}

function DocumentReviewPage({
  docsToBeReviewed,
  onReview,
}: DocumentReviewPageProps) {
  const [isError, setIsError] = useState(false)

  function handleReview(input: RegisterInput['reviewStatus']) {
    onReview(input).catch((e) => {
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
              Failed to complete document review to use GEARBOx!
            </h1>
            <p>
              Pleaset refresh thie page and try again. If the problem persists,
              please contact us to get help.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-16 text-lg text-center">
              Review the following updated documents to continue your access to
              GEARBOx
            </h1>
            <DocumentReviewForm
              docsToBeReviewed={docsToBeReviewed}
              onReview={handleReview}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default DocumentReviewPage
