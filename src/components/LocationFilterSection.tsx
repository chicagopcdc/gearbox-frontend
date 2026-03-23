// components/LocationFilterSection.tsx
import React from 'react'
import Button from './Inputs/Button'
import { LocationFilterState, LocationMode } from '../model'

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
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="locationMode"
            value="address"
            checked={filter.mode === 'address'}
            onChange={() => changeMode('address')}
            disabled={true}
          />
          <span>Use address (TBD)</span>
        </label>
      </div>

      {filter.mode === 'coordinates' ? (
        <>
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
    </div>
  )
}
