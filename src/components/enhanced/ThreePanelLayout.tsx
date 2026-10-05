import React, { useState } from 'react'
import useScreenSize from '../../hooks/useScreenSize'
import Button from '../Inputs/Button'

type ThreePanelLayoutProps = {
  sidebar: React.ReactNode
  form: React.ReactNode
  results: React.ReactNode
}

function ThreePanelLayout({ sidebar, form, results }: ThreePanelLayoutProps) {
  const screenSize = useScreenSize()
  const [view, setView] = useState<'form' | 'result'>('form')

  if (screenSize.smAndDown) {
    return (
      <>
        <div
          className="flex justify-center sticky top-0 bg-white z-10"
          style={{
            minHeight: '2.5rem',
          }}
        >
          <Button
            size="small"
            block
            outline={view !== 'form'}
            onClick={() => setView('form')}
          >
            <div className="py-2">Patient Info</div>
          </Button>
          <Button
            size="small"
            block
            outline={view !== 'result'}
            onClick={() => setView('result')}
          >
            Open Trials
          </Button>
        </div>
        <div className="bg-white">{sidebar}</div>
        <section className={`${view === 'form' ? '' : 'hidden'}`}>
          {form}
        </section>
        <section className={`${view === 'result' ? '' : 'hidden'}`}>
          {results}
        </section>
      </>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <aside className="w-56 overflow-y-auto border-r border-gray-300 bg-white">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto bg-white">{form}</main>
      <aside className="w-2/5 min-w-[380px] overflow-y-auto border-l border-gray-300 bg-white">
        {results}
      </aside>
    </div>
  )
}

export default ThreePanelLayout
