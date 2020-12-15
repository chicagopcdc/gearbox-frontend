import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'
import TrialMatchInfo from './TrialMatchInfo'
import { MatchInfoAlgorithm, Study } from '../model'

const styles = {
  container: 'bg-gray-300 my-4 p-4',
  title: 'font-bold text-lg pb-2',
  field: {
    container: 'mb-1',
    title: 'font-bold inline pr-2',
  },
}

type TrialCardProps = {
  matchInfoAlgorithm?: MatchInfoAlgorithm
  study: Study
}

function TrialCard({ matchInfoAlgorithm, study }: TrialCardProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const handleOpen = () => setIsDropDownOpen(true)
  const handleClose = () => setIsDropDownOpen(false)
  return (
    <div className={styles.container}>
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">{study.title}</h2>
        <div className="flex">
          {matchInfoAlgorithm !== undefined && (
            <TrialMatchInfo
              studyId={study.id}
              studyMatchInfo={matchInfoAlgorithm}
              studyTitle={study.title}
            />
          )}
          {isDropDownOpen ? (
            <button type="button" onClick={handleClose}>
              <ChevronUp color="#C00" />
            </button>
          ) : (
            <button type="button" onClick={handleOpen}>
              <ChevronDown />
            </button>
          )}
        </div>
      </div>

      <div className={isDropDownOpen ? 'pt-4' : 'hidden'}>
        <div className={styles.field.container}>
          <h3 className={styles.field.title}>Research group</h3>
          {study.group}
        </div>
        <div className={styles.field.container}>
          <h3 className={styles.field.title}>Location</h3>
          {study.location}
        </div>
        <details className={styles.field.container}>
          <summary>
            <h3 className={styles.field.title}>Registration information</h3>
          </summary>
          {study.registerLinks?.map((link, i) => (
            <a
              className="block text-blue-700"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
            >
              {link.name}
            </a>
          ))}
        </details>
      </div>
    </div>
  )
}

export default TrialCard
