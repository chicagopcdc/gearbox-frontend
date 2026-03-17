import { useMemo, useState } from 'react'
import Select from 'react-select'
import type { SingleValue } from 'react-select'
import { useNavigate } from 'react-router-dom'
import type { MatchFormValues } from '../model'

type DiagnosisOption = {
  value: string
  label: string
}

type InputFieldProps = {
  id: string
  label: string
  children: React.ReactNode
}

function InputField({ id, label, children }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
      {children}
    </section>
  )
}

function FormPage() {
  const navigate = useNavigate()
  const [age, setAge] = useState<string>('')
  const [sex, setSex] = useState<'male' | 'female' | ''>('')
  const [weight, setWeight] = useState<string>('')
  const [showRelevantOnly, setShowRelevantOnly] = useState<boolean>(true)
  const [diagnosis, setDiagnosis] = useState<DiagnosisOption | null>(null)
  const [diseaseStatus, setDiseaseStatus] = useState<string>('')

  const diagnosisOptions = useMemo<DiagnosisOption[]>(
    () => [
      { value: 'aml', label: 'Acute Myeloid Leukemia (AML)' },
      { value: 'all', label: 'Acute Lymphoblastic Leukemia (ALL)' },
      { value: 'lymphoma', label: 'Lymphoma' },
      { value: 'mmd', label: 'Myelodysplastic Syndrome (MDS)' },
    ],
    []
  )

  function handleMatchTrials() {
    const prefill: MatchFormValues = {}

    if (age !== '') prefill[1] = Number(age)
    if (weight !== '') prefill[2] = Number(weight)
    if (sex !== '') prefill[3] = sex === 'male' ? 1 : 2

    const diagnosisMap: Record<DiagnosisOption['value'], number> = {
      aml: 7,
      all: 16,
      lymphoma: 59,
      mmd: 12,
    }

    if (diagnosis?.value) {
      prefill[8] = diagnosisMap[diagnosis.value]
    }

    sessionStorage.setItem(
      'gearbox:prefill-user-input',
      JSON.stringify(prefill)
    )
    sessionStorage.setItem(
      'gearbox:prefill-user-input-meta',
      JSON.stringify({
        diseaseStatus,
      })
    )

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Step 2
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Patient Information
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Enter patient details, apply question filtering, then continue to
            trial matching.
          </p>
        </header>

        <SectionCard>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField id="age" label="Age">
                <input
                  id="age"
                  type="number"
                  min={0}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </InputField>

              <InputField id="weight" label="Weight (kg)">
                <input
                  id="weight"
                  type="number"
                  min={0}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 42.5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </InputField>
            </div>

            <InputField id="biological-sex" label="Biological Sex">
              <div id="biological-sex" className="flex flex-wrap gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="biologicalSex"
                    value="male"
                    checked={sex === 'male'}
                    onChange={() => setSex('male')}
                    className="h-4 w-4 text-primary border-gray-300"
                  />
                  Male
                </label>
                <label className="inline-flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="biologicalSex"
                    value="female"
                    checked={sex === 'female'}
                    onChange={() => setSex('female')}
                    className="h-4 w-4 text-primary border-gray-300"
                  />
                  Female
                </label>
              </div>
            </InputField>

            <div className="border-t border-gray-200 pt-5">
              <label className="inline-flex items-center gap-3 text-sm sm:text-base text-gray-800">
                <input
                  type="checkbox"
                  checked={showRelevantOnly}
                  onChange={(e) => setShowRelevantOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                Show relevant questions only
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Toggle to view additional optional screening questions.
              </p>
            </div>

            {!showRelevantOnly && (
              <div className="space-y-6 border-t border-gray-200 pt-5">
                <InputField id="diagnosis" label="Diagnosis">
                  <Select
                    inputId="diagnosis"
                    isSearchable
                    options={diagnosisOptions}
                    value={diagnosis}
                    onChange={(value: SingleValue<DiagnosisOption>) =>
                      setDiagnosis(value)
                    }
                    placeholder="Search diagnosis..."
                  />
                </InputField>

                <InputField id="disease-status" label="Disease Status">
                  <input
                    id="disease-status"
                    type="text"
                    value={diseaseStatus}
                    onChange={(e) => setDiseaseStatus(e.target.value)}
                    placeholder="e.g. Relapsed, Refractory"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </InputField>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleMatchTrials}
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-white font-semibold hover:opacity-90 transition"
              >
                Match Trials
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

export default FormPage
