import Button from './Inputs/Button'
import LinkExternal from './LinkExternal'
import React from 'react'

export function ErrorRetry({ retry }: { retry: () => void }) {
  return (
    <>
      <div className="pb-8">
        <p className="pb-4">Something went wrong! Please try again.</p>
        <Button size="normal" onClick={retry}>
          Try again
        </Button>
      </div>
      <div className="pb-4">
        <p>
          &quot;Try again&quot; button did not fix the problem? Please try hard
          refresh.
        </p>
        <ul className="list-disc pl-8">
          <li>
            Chrome or Firefox: Press <strong>Ctrl + F5</strong> on Windows or{' '}
            <strong>Cmd + Shift + R</strong> on Mac
          </li>
          <li>
            Safari (Mac): Press <strong>Cmd + Option + R</strong>
          </li>
        </ul>
      </div>
      <p>
        Hard refresh did not fix the problem? Please reach out to{' '}
        <LinkExternal
          className="underline text-primary"
          to="mailto:gearbox_help@lists.uchicago.edu"
        >
          gearbox_help@lists.uchicago.edu
        </LinkExternal>
        .
      </p>
    </>
  )
}
