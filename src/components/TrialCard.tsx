import { ReactNode, useState } from 'react'
import parse from 'html-react-parser'
import { ChevronDown, ChevronUp } from 'react-feather'
import LinkExternal from './LinkExternal'
import type { Study } from '../model'
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

function isLocationLink(link: { name?: string; href?: string }) {
  const normalizedName = link.name?.trim().toLowerCase()
  return (
    normalizedName === 'contacts and locations' ||
    normalizedName === 'locations' ||
    normalizedName === 'location' ||
    link.href?.includes('#contacts-and-locations')
  )
}

function TrialCard({ study, children }: TrialCardProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const handleOpen = () => setIsDropDownOpen(true)
  const handleClose = () => setIsDropDownOpen(false)

  if (study === undefined) return null

  const locationLinks = (study.links ?? []).filter(isLocationLink)
  const otherLinks = (study.links ?? []).filter((link) => !isLocationLink(link))

  return (
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
              {study.sites.length > 5 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  +{study.sites.length - 5} more
                </span>
              )}
            </h3>

            <ul className="list-disc ml-8">
              {study.sites.slice(0, 5).map((site) => (
                <li key={site.id}>{site.name}</li>
              ))}
            </ul>

            {study.sites.length > 5 && (
              <p className="mt-2 text-sm text-gray-600">
                To see the full list of active sites, use the link below.
              </p>
            )}

            {locationLinks.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {study.sites.length > 5 ? (
                  <>
                    Showing 5 of {study.sites.length} locations.{' '}
                    <LinkExternal
                      className="text-blue-700"
                      to={locationLinks[0].href}
                    >
                      See all contacts and locations
                    </LinkExternal>
                  </>
                ) : (
                  <>
                    <LinkExternal
                      className="text-blue-700"
                      to={locationLinks[0].href}
                    >
                      See full location details
                    </LinkExternal>
                  </>
                )}
              </p>
            )}
          </div>
        ) : null}

        {otherLinks.length > 0 ? (
          <div className={styles.field.container}>
            <h3 className={styles.field.title}>
              {otherLinks.length > 1 ? 'Links' : 'Link'}
            </h3>
            <ul className="list-disc ml-8">
              {otherLinks.map(({ name, href }) => (
                <li key={`${name}-${href}`}>
                  <LinkExternal className="block text-blue-700" to={href}>
                    {name}
                  </LinkExternal>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!!study.follow_up_info && parse(study.follow_up_info, { replace })}
      </div>
    </div>
  )
}

export default TrialCard
