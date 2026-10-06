import React, {
  useCallback,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react'
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
  onActiveCategoryChange: (id: number | null) => void
  openCategoryId: number | null
  onOpenCategoryChange: (id: number | null) => void
  scrollRootRef: React.RefObject<HTMLDivElement>
  registerScrollTarget: (id: number) => (el: HTMLElement | null) => void
  highlightedFieldId: number | null
}

export type EnhancedMatchFormHandle = {
  cancelPendingUpdate: () => void
  getValues: () => MatchFormValues
  replaceValues: (values: MatchFormValues) => void
}

function EnhancedMatchForm(
  {
    config,
    matchInput,
    isFilterActive,
    updateMatchInput,
    setIsUpdating,
    importantQuestionsConfig, // eslint-disable-line @typescript-eslint/no-unused-vars
    locationFilterSection,
    onActiveCategoryChange,
    openCategoryId,
    onOpenCategoryChange,
    scrollRootRef,
    registerScrollTarget,
    highlightedFieldId,
  }: EnhancedMatchFormProps,
  ref: React.ForwardedRef<EnhancedMatchFormHandle>
) {
  const [values, setValues] = useState(getDefaultValues(config))
  useEffect(() => setValues({ ...matchInput }), [matchInput])

  const formEl = useRef<HTMLFormElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionHeaderRefs = useRef<Map<number, HTMLElement>>(new Map())

  const cancelPendingUpdate = useCallback(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }

    setIsUpdating(false)
  }, [setIsUpdating])

  useImperativeHandle(
    ref,
    () => ({
      cancelPendingUpdate,

      getValues() {
        return { ...values }
      },

      replaceValues(nextValues) {
        cancelPendingUpdate()
        setValues({ ...nextValues })
      },
    }),
    [cancelPendingUpdate, values]
  )

  useEffect(
    () => () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    },
    []
  )

  const handleChange =
    (fieldType: MatchFormFieldConfig['type']) =>
    (e: {
      target: {
        name: string
        value: string | number[]
      }
    }) => {
      if (fieldType === 'checkbox' || fieldType === 'multiselect') {
        return
      }

      const { name, value } = e.target

      let nextValue: string | number | number[] | undefined

      if (fieldType === 'picklist') {
        nextValue = Array.isArray(value) ? value : []
      } else if (value === '') {
        nextValue = undefined
      } else if (fieldType === 'select' || fieldType === 'radio') {
        nextValue = Number(value)
      } else {
        nextValue = value
      }

      const newValues: MatchFormValues = {
        ...values,
        [name]: nextValue,
      }

      setValues(newValues)

      cancelPendingUpdate()

      if (formEl?.current?.reportValidity()) {
        setIsUpdating(true)
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = undefined
          updateMatchInput(clearShowIfField(config, newValues))
          setIsUpdating(false)
        }, 1000)
      } else setIsUpdating(false)
    }

  useEffect(() => {
    const root = scrollRootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const groupId = Number(entry.target.getAttribute('data-group-id'))
          if (!Number.isNaN(groupId)) {
            onActiveCategoryChange(groupId)
          }
        }
      },
      {
        root,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0,
      }
    )

    observerRef.current = observer

    sectionHeaderRefs.current.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()

      if (observerRef.current === observer) {
        observerRef.current = null
      }
    }
  }, [onActiveCategoryChange, scrollRootRef])

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

  const handleToggle = (groupId: number) => (next: boolean) => {
    onOpenCategoryChange(next ? groupId : null)

    if (next) {
      onActiveCategoryChange(groupId)
    }
  }

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
            isOpen={openCategoryId === group.id}
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

export default forwardRef(EnhancedMatchForm)
