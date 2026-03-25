// components/LocationFilterSection.tsx
import React, { useState } from 'react'
import Button from './Inputs/Button'
import { LocationFilterState, LocationMode } from '../model'
import ReactTooltip from 'react-tooltip'

type LocationFilterSectionProps = {
  filter: LocationFilterState
  onChange: (next: LocationFilterState) => void
  onApply: () => void
  onClear: () => void
  isActive: boolean
  error?: string | null
  isResolving?: boolean
}

export const LocationFilterSection: React.FC<LocationFilterSectionProps> = ({
  filter,
  onChange,
  onApply,
  onClear,
  isActive,
  error,
  isResolving,
}) => {
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pasteValue, setPasteValue] = useState('')
  const [pasteError, setPasteError] = useState<string | null>(null)

  function parseGoogleMapsLatLon(value: string) {
    const trimmed = value.trim()

    // matches: "41.92288624820761, -87.64602075218657"
    const match = trimmed.match(
      /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
    )

    if (!match) {
      return null
    }

    const lat = match[1]
    const lon = match[2]

    return { lat, lon }
  }

  function handlePasteSubmit() {
    const parsed = parseGoogleMapsLatLon(pasteValue)

    if (!parsed) {
      setPasteError(
        'Please paste coordinates in this format: 41.92288624820761, -87.64602075218657'
      )
      return
    }

    onChange({
      ...filter,
      mode: 'coordinates',
      lat: parsed.lat,
      lon: parsed.lon,
    })

    setPasteValue('')
    setPasteError(null)
    setShowPasteModal(false)
  }

  function updateField<K extends keyof LocationFilterState>(
    key: K,
    value: LocationFilterState[K]
  ) {
    onChange({
      ...filter,
      [key]: value,
    })
  }

  function changeMode(mode: LocationMode) {
    onChange({
      ...filter,
      mode,
    })
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-md bg-gray-50 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
          Location filter (optional)
        </h2>
        {isActive && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-green-100 text-green-800">
            Active
          </span>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-4 mb-2 text-xs text-gray-700">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="locationMode"
            value="coordinates"
            checked={filter.mode === 'coordinates'}
            onChange={() => changeMode('coordinates')}
          />
          <span>Use coordinates</span>
        </label>
        <label
          className="flex items-center gap-1 cursor-pointer"
          data-tip
          data-for="location-address-tbd"
        >
          <input
            type="radio"
            name="locationMode"
            value="address"
            checked={filter.mode === 'address'}
            onChange={() => changeMode('address')}
            disabled={true}
          />
          <ReactTooltip
            id="location-address-tbd"
            effect="solid"
            place="top"
            type="dark"
          >
            <span>This feature is under development</span>
          </ReactTooltip>
          <span>Use address (TBD)</span>
        </label>
      </div>

      {filter.mode === 'coordinates' ? (
        <>
          <div className="mb-3 rounded border border-blue-100 bg-blue-50 p-3 text-xs text-gray-700">
            <p className="mb-2 font-medium">
              If you don't know your lat lon please follow this steps:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>
                Go to{' '}
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  Google Maps
                </a>
              </li>
              <li>Type your address</li>
              <li>Right click on the location pin</li>
              <li>
                Click on the lat lon (usually the first item in the options) and
                paste it here.
              </li>
            </ol>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setPasteError(null)
                  setShowPasteModal(true)
                }}
                className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100"
              >
                Paste from Google Maps
              </button>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100"
              >
                Open Google Maps
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <label className="text-xs text-gray-700">
              <span className="block mb-1">Latitude</span>
              <input
                type="number"
                step="any"
                value={filter.lat}
                onChange={(e) => updateField('lat', e.target.value)}
                placeholder="e.g. 41.8781"
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="text-xs text-gray-700">
              <span className="block mb-1">Longitude</span>
              <input
                type="number"
                step="any"
                value={filter.lon}
                onChange={(e) => updateField('lon', e.target.value)}
                placeholder="e.g. -87.6298"
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="text-xs text-gray-700 md:col-span-2">
              <span className="block mb-1">Max distance</span>
              <div className="flex items-stretch">
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={filter.distance}
                  onChange={(e) => updateField('distance', e.target.value)}
                  placeholder="e.g. 25"
                  className="flex-1 min-w-0 rounded-l border border-gray-300 px-2 py-1 text-sm"
                />
                <select
                  value={filter.unit}
                  onChange={(e) =>
                    updateField(
                      'unit',
                      e.target.value as LocationFilterState['unit']
                    )
                  }
                  className="w-16 flex-shrink-0 rounded-r border border-gray-300 border-l-0 px-2 py-1 text-sm bg-white"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
            </label>
          </div>

          <p className="mb-2 text-[0.7rem] text-gray-500">
            Example: <span className="font-mono">41.8781, -87.6298</span> ≈
            Chicago, IL
          </p>
        </>
      ) : (
        <>
          <div className="space-y-2 mb-2">
            <label className="text-xs text-gray-700">
              <span className="block mb-1">Address</span>
              <input
                type="text"
                value={filter.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Street, city, state, ZIP"
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="text-xs text-gray-700">
              <span className="block mb-1">Max distance</span>
              <div className="flex items-stretch">
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={filter.distance}
                  onChange={(e) => updateField('distance', e.target.value)}
                  placeholder="e.g. 25"
                  className="flex-1 min-w-0 rounded-l border border-gray-300 px-2 py-1 text-sm"
                />
                <select
                  value={filter.unit}
                  onChange={(e) =>
                    updateField(
                      'unit',
                      e.target.value as LocationFilterState['unit']
                    )
                  }
                  className="w-16 flex-shrink-0 rounded-r border border-gray-300 border-l-0 px-2 py-1 text-sm bg-white"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
            </label>
          </div>

          <p className="mb-2 text-[0.7rem] text-gray-500">
            Example:{' '}
            <span className="font-mono">300 N Ingalls St, Ann Arbor, MI</span>
          </p>
        </>
      )}

      {error && (
        <p className="mb-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-[0.7rem] text-gray-500">
          {filter.mode === 'address'
            ? 'Your address will be converted to latitude/longitude before filtering trials.'
            : 'Coordinates and distance are sent to filter trials by location.'}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClear}
            className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            disabled={!!isResolving}
          >
            Clear
          </button>
          <Button size="small" onClick={onApply} disabled={!!isResolving}>
            {isResolving ? 'Applying…' : 'Apply'}
          </Button>
        </div>
      </div>
      {showPasteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: '#00000055' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="paste-google-maps-title"
        >
          <div className="w-full max-w-lg rounded bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3
                id="paste-google-maps-title"
                className="text-sm font-semibold"
              >
                Paste coordinates from Google Maps
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowPasteModal(false)
                  setPasteError(null)
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <p className="mb-3 text-xs text-gray-700">
              Paste a value like{' '}
              <span className="font-mono">
                41.92288624820761, -87.64602075218657
              </span>
            </p>

            <textarea
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
              placeholder="41.92288624820761, -87.64602075218657"
            />

            {pasteError && (
              <p className="mt-2 text-xs text-red-600" role="alert">
                {pasteError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasteModal(false)
                  setPasteError(null)
                }}
                className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <Button size="small" onClick={handlePasteSubmit}>
                Use coordinates
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
