import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import LinkExternal from './LinkExternal'
import type { Study } from '../model'

const styles = {
  container: 'bg-gray-200 my-4 p-4',
  title: 'font-bold text-lg pb-2',
  field: {
    container: 'mb-2',
    title: 'font-bold inline pr-2',
  },
}

type TrialCardProps = {
  study: Study
  children?: ReactNode
}

function TrialCard({ study, children }: TrialCardProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const handleOpen = () => setIsDropDownOpen(true)
  const handleClose = () => setIsDropDownOpen(false)
  return study === undefined ? null : (
    <div className={styles.container}>
      <div>
        <div className="flex justify-between pb-4">
          <h2 className="text-lg font-bold">{study.code}</h2>
          <div className="flex">
            {children}
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
        {study.locations?.length > 0 ? (
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
        {study.links?.length > 0 ? (
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
      </div>
    </div>
  )
}

export default TrialCard
