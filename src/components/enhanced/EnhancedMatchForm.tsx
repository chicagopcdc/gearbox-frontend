import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DropdownSection from '../DropdownSection'
import FieldWrapper from '../FieldWrapper'
import Field from '../Inputs/Field'
import {
  clearShowIfField,
  getDefaultValues,
  getIsFieldShowing,
} from '../../utils'
import type { MatchFormProps } from '../MatchForm'
import type { MatchFormValues, MatchFormFieldConfig } from '../../model'

type EnhancedMatchFormProps = MatchFormProps & {
  activeCategoryId: number | null
  onActiveCategoryChange: (id: number | null) => void
  registerScrollTarget: (id: number) => (el: HTMLElement | null) => void
  highlightedFieldId: number | null
}

function EnhancedMatchForm({
  config,
  matchInput,
  isFilterActive,
  updateMatchInput,
  setIsUpdating,
  importantQuestionsConfig, // eslint-disable-line @typescript-eslint/no-unused-vars
  locationFilterSection,
  activeCategoryId,
  onActiveCategoryChange,
  registerScrollTarget,
  highlightedFieldId,
}: EnhancedMatchFormProps) {
  const [values, setValues] = useState(getDefaultValues(config))
  useEffect(() => setValues({ ...matchInput }), [matchInput])

  const formEl = useRef<HTMLFormElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionHeaderRefs = useRef<Map<number, HTMLElement>>(new Map())
  const suspendObserverRef = useRef(false)

  const handleChange =
    (fieldType: MatchFormFieldConfig['type']) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (fieldType === 'checkbox' || fieldType === 'multiselect') {
        return
      }
      const { name, value } = e.target
      const isNumberValue = fieldType === 'select' || fieldType === 'radio'
      const isEmptyValue = !value
      const newValues: MatchFormValues = {
        ...values,
        [name]: isEmptyValue ? undefined : isNumberValue ? +value : value,
      }
      setValues(newValues)

      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current)

      if (formEl?.current?.reportValidity()) {
        setIsUpdating(true)
        timeoutRef.current = setTimeout(() => {
          updateMatchInput(clearShowIfField(config, newValues))
          setIsUpdating(false)
          clearTimeout(timeoutRef.current)
        }, 1000)
      } else setIsUpdating(false)
    }

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (suspendObserverRef.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const groupId = Number(entry.target.getAttribute('data-group-id'))
            if (!isNaN(groupId)) {
              onActiveCategoryChange(groupId)
            }
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    )

    sectionHeaderRefs.current.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [onActiveCategoryChange])

  const registerSectionHeader =
    (groupId: number) => (el: HTMLElement | null) => {
      if (el) {
        sectionHeaderRefs.current.set(groupId, el)
        if (observerRef.current) {
          observerRef.current.observe(el)
        }
      } else {
        const existing = sectionHeaderRefs.current.get(groupId)
        if (existing && observerRef.current) {
          observerRef.current.unobserve(existing)
        }
        sectionHeaderRefs.current.delete(groupId)
      }
    }

  const groupOpenState = useMemo(() => {
    const state: Record<number, boolean> = {}
    config.groups.forEach((group) => {
      state[group.id] = group.id === activeCategoryId
    })
    return state
  }, [activeCategoryId, config.groups])

  const handleToggle = (groupId: number) => (next: boolean) => {
    suspendObserverRef.current = true
    onActiveCategoryChange(next ? groupId : null)
    setTimeout(() => {
      suspendObserverRef.current = false
    }, 500)
  }

  useEffect(() => {
    if (activeCategoryId !== null) {
      suspendObserverRef.current = true
      setTimeout(() => {
        suspendObserverRef.current = false
      }, 500)
    }
  }, [activeCategoryId])

  return (
    <form ref={formEl}>
      {locationFilterSection && (
        <DropdownSection
          backgroundColor="bg-white"
          name="Location Filter (Optional)"
          isCollapsedAtStart={true}
        >
          {locationFilterSection}
        </DropdownSection>
      )}
      {config.groups.map((group) => (
        <div
          key={group.id}
          ref={registerSectionHeader(group.id)}
          data-group-id={group.id}
        >
          <DropdownSection
            id={`category-${group.id}`}
            backgroundColor="bg-white"
            name={group.name || 'General'}
            isOpen={groupOpenState[group.id]}
            onToggle={handleToggle(group.id)}
          >
            {config.fields.map(
              ({
                id,
                groupId,
                defaultValue, // eslint-disable-line @typescript-eslint/no-unused-vars
                relevant,
                showIf,
                ...fieldConfig
              }) => {
                if (groupId !== group.id) return null

                const isFieldShowing =
                  (!isFilterActive || relevant) &&
                  (showIf === undefined ||
                    getIsFieldShowing(showIf, config, values))

                const isHighlighted = highlightedFieldId === id
                return (
                  <FieldWrapper key={id} isShowing={isFieldShowing}>
                    <div
                      ref={registerScrollTarget(id)}
                      data-field-id={id}
                      className={
                        isHighlighted
                          ? 'border-primary ring-2 ring-red-200 transition-all duration-300'
                          : ''
                      }
                    >
                      <Field
                        config={{
                          ...fieldConfig,
                          name: String(id),
                          disabled: !relevant,
                        }}
                        value={values[id]}
                        onChange={handleChange(fieldConfig.type)}
                      />
                    </div>
                  </FieldWrapper>
                )
              }
            )}
          </DropdownSection>
        </div>
      ))}
    </form>
  )
}

export default EnhancedMatchForm
