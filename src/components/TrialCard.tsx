import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'react-feather'
import LinkExternal from './LinkExternal'
import TrialMatchInfo from './TrialMatchInfo'
import type { MatchInfoAlgorithm, Study } from '../model'

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
  return study === undefined ? null : (
    <div className={styles.container}>
      <div>
        <div className="flex justify-between pb-4">
          <h2 className="text-lg font-bold">{study.code}</h2>
          <div className="flex">
            {matchInfoAlgorithm !== undefined && (
              <TrialMatchInfo
                study={study}
                studyMatchInfo={matchInfoAlgorithm}
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
        <div className={styles.field.container}>
          <h3 className={styles.field.title}>Title</h3>
          <p className={isDropDownOpen ? '' : 'truncate'}>{study.title}</p>
        </div>
      </div>

      <div className={isDropDownOpen ? '' : 'hidden'}>
        {study.description ? (
          <div className={styles.field.container}>
            <h3 className={styles.field.title}>Description</h3>
            <p>{study.description}</p>
          </div>
        ) : null}
        {study.locations.length > 0 ? (
          <div className={styles.field.container}>
            <h3 className={styles.field.title}>
              {study.locations.length > 1 ? 'Locations' : 'Location'}
            </h3>
            <ul className="list-disc ml-8">
              {study.locations.map((location) => (
                <li key={location}>{location}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {study.links.length > 0 ? (
          <div className={styles.field.container}>
            <h3 className={styles.field.title}>
              {study.links.length > 1 ? 'Links' : 'Link'}
            </h3>
            <ul className="list-disc ml-8">
              {study.links.map(({ name, href }) => (
                <li key={name}>
                  <LinkExternal className="block text-blue-700" to={href}>
                    {name}
                  </LinkExternal>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className={`${styles.field.container} italic mt-12 text-sm`}>
          <h3 className={styles.field.title}>
            Pediatric Clinical Trial Nurse Navigator One-on-One Support
          </h3>
          <p>
            To connect with a Pediatric Clinical Trial Nurse Navigator at the
            Leukemia {'&'} Lymphoma Society who will personally assist your
            patient throughout the entire clinical-trial process, click this
            link to fill out a{' '}
            <LinkExternal
              className="text-blue-700"
              to="https://lls-forms.careboxhealth.com/?IRC=NOIRC"
            >
              Clinical Trial Support Center referral form
            </LinkExternal>
            . One of our pediatric oncology nurses will call your patient within
            1 business day and provide you with a copy of the individualized
            trial search results. For general inquiries, simply email{' '}
            <LinkExternal
              className="text-blue-700"
              to="mailto:askPedAL@lls.org"
            >
              askPedAL@lls.org
            </LinkExternal>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrialCard
