import { ReactNode, useState } from 'react'
import parse from 'html-react-parser'
import { ChevronDown, ChevronUp } from 'react-feather'
import LinkExternal from './LinkExternal'
import type { Study } from '../model'
import { gaEvents } from '../hooks/useGoogleAnalytics'
import { replace } from '../html-react-parser-utils'

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

// TODO: Tianyun 08/16/2023 - this html string should return from the backend in the future
const extraInfo = `
        <div className="mb-2 italic mt-12 text-sm">
          <h3 className="font-bold inline pr-2">
            Pediatric Clinical Trial Nurse Navigator One-on-One Support
          </h3>
          <p>
            To connect with a Pediatric Clinical Trial Nurse Navigator at the
            Leukemia & Lymphoma Society who will personally assist your
            patient throughout the entire clinical-trial process, click this
            link to fill out a
            <LinkExternal
              className="text-blue-700"
              to="https://lls-forms.careboxhealth.com/?IRC=NOIRC"
              onClick={gaEvents.clickLLSLinkEvent}
            >
              Clinical Trial Support Center referral form
            </LinkExternal>
            . One of our pediatric oncology nurses will call your patient within
            1 business day and provide you with a copy of the individualized
            trial search results. For general inquiries, simply email
            <LinkExternal
              className="text-blue-700"
              to="mailto:askPedAL@lls.org"
            >
              askPedAL@lls.org
            </LinkExternal>
            .
          </p>
        </div>
`

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
          <p className={isDropDownOpen ? '' : 'truncate'}>{study.name}</p>
        </div>
      </div>

      <div className={isDropDownOpen ? '' : 'hidden'}>
        {study.description ? (
          <div className={styles.field.container}>
            <h3 className={styles.field.title}>Description</h3>
            <p>{study.description}</p>
          </div>
        ) : null}
        {study.sites?.length > 0 ? (
          <div className={styles.field.container}>
            <h3 className={styles.field.title}>
              {study.sites.length > 1 ? 'Locations' : 'Location'}
            </h3>
            <ul className="list-disc ml-8">
              {study.sites.map((site) => (
                <li key={site.id}>{site.name}</li>
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
        {parse(extraInfo, { replace })}
      </div>
    </div>
  )
}

export default TrialCard
