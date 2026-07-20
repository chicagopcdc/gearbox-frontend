import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { X } from 'react-feather'
import type { MatchGroups, Study } from '../model'
import 'leaflet/dist/leaflet.css'

type TrialMapMarker = {
  group: 'matched' | 'undetermined'
  id: string
  latitude: number
  longitude: number
  site: Study['sites'][number]
  study: Study
}

type TrialMapModalProps = {
  closeModal: () => void
  matchGroups: MatchGroups
  studies: Study[]
}

const markerIcons = {
  matched: L.divIcon({
    className: '',
    html: '<span class="block h-4 w-4 rounded-full border-2 border-white bg-primary shadow-md"></span>',
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  }),
  undetermined: L.divIcon({
    className: '',
    html: '<span class="block h-4 w-4 rounded-full border-2 border-white bg-amber-600 shadow-md"></span>',
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  }),
}

function parseCoordinate(
  value: string | null,
  minimum: number,
  maximum: number
) {
  if (value === null || value.trim() === '') return null

  const coordinate = Number(value)
  return Number.isFinite(coordinate) &&
    coordinate >= minimum &&
    coordinate <= maximum
    ? coordinate
    : null
}

export function getTrialMapMarkers(
  studies: Study[],
  matchGroups: MatchGroups
): TrialMapMarker[] {
  const studyGroups = new Map<number, TrialMapMarker['group']>()

  for (const studyId of matchGroups.matched ?? []) {
    studyGroups.set(studyId, 'matched')
  }

  for (const studyId of matchGroups.undetermined ?? []) {
    if (!studyGroups.has(studyId)) studyGroups.set(studyId, 'undetermined')
  }

  return studies.flatMap((study) => {
    const group = studyGroups.get(study.id)
    if (!group) return []

    return study.sites.flatMap((site) => {
      const latitude = parseCoordinate(site.location_lat, -90, 90)
      const longitude = parseCoordinate(site.location_long, -180, 180)

      if (latitude === null || longitude === null) return []

      return [
        {
          group,
          id: `${study.id}-${site.id}`,
          latitude,
          longitude,
          site,
          study,
        },
      ]
    })
  })
}

function FitMapToMarkers({ markers }: { markers: TrialMapMarker[] }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) return

    const bounds = L.latLngBounds(
      markers.map(({ latitude, longitude }) => [latitude, longitude])
    )
    map.fitBounds(bounds, { maxZoom: 10, padding: [32, 32] })
  }, [map, markers])

  return null
}

function TrialMapModal({
  closeModal,
  matchGroups,
  studies,
}: TrialMapModalProps) {
  const markers = useMemo(
    () => getTrialMapMarkers(studies, matchGroups),
    [studies, matchGroups]
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="presentation"
    >
      <section
        aria-labelledby="trial-map-title"
        aria-modal="true"
        className="flex max-h-full w-full max-w-6xl flex-col rounded bg-white shadow-xl"
        role="dialog"
      >
        <header className="flex items-start justify-between border-b px-4 py-3 sm:px-6">
          <div>
            <h2 id="trial-map-title" className="text-xl font-bold text-primary">
              Trial locations
            </h2>
            <p className="text-sm text-gray-600">
              {markers.length} {markers.length === 1 ? 'site' : 'sites'} with
              coordinates in matched and undetermined trials
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                Matched
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-600" />
                Undetermined
              </span>
            </div>
          </div>
          <button
            aria-label="Close trial map"
            className="rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={closeModal}
            type="button"
          >
            <X />
          </button>
        </header>

        {markers.length > 0 ? (
          <MapContainer
            center={[39.8, -98.6]}
            className="h-[70vh] min-h-[24rem] w-full"
            scrollWheelZoom
            worldCopyJump
            zoom={4}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitMapToMarkers markers={markers} />
            {markers.map(({ group, id, latitude, longitude, site, study }) => (
              <Marker
                icon={markerIcons[group]}
                key={id}
                position={[latitude, longitude]}
              >
                <Popup>
                  <div className="max-w-xs">
                    <p
                      className={`mb-1 font-bold ${
                        group === 'matched' ? 'text-primary' : 'text-amber-700'
                      }`}
                    >
                      {group === 'matched' ? 'Matched' : 'Undetermined'}
                    </p>
                    <p className="font-bold">{study.code}</p>
                    <p>{study.name}</p>
                    <p className="mt-2 font-bold">{site.name}</p>
                    <p>
                      {[site.city, site.state, site.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex min-h-[24rem] items-center justify-center p-8 text-center text-gray-600">
            None of the matched or undetermined trial sites have valid
            coordinates.
          </div>
        )}
      </section>
    </div>
  )
}

export default TrialMapModal
