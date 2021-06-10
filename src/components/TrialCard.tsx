import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'
import TrialMatchInfo from './TrialMatchInfo'
import { MatchInfoAlgorithm, Study } from '../model'

const styles = {
  container: 'bg-gray-200 my-4 p-4',
  title: 'font-bold text-lg pb-2',
  field: {
    container: 'mb-2',
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
            <button
              type="button"
              onClick={handleClose}
              aria-label="Collapse trial card"
            >
              <ChevronUp color="#C00" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Expand trial card"
            >
              <ChevronDown />
            </button>
          )}
        </div>
      </div>

      <div className={isDropDownOpen ? 'pt-4' : 'hidden'}>
        <div className={styles.field.container}>
          <h3 className={styles.field.title}>Description</h3>
          <p>{study.description}</p>
        </div>
        <div className={styles.field.container}>
          <h3 className={styles.field.title}>Locations</h3>
          <ul className="list-disc">
            {study.locations.map((location) => (
              <li key={location}>{location}</li>
            ))}
          </ul>
        </div>
        <div className={styles.field.container}>
          <h3 className={styles.field.title}>Links</h3>
          <ul className="list-disc ml-8">
            {study.links.map(({ name, href }) => (
              <li key={name}>
                <a
                  className="block text-blue-700"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TrialCard
