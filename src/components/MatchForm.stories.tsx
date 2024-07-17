import { action } from '@storybook/addon-actions'
import MatchForm from './MatchForm'
import type { MatchFormConfig, MatchFormValues } from '../model'
import '../index.css'

export default {
  title: 'Forms/MatchForm',
  component: MatchForm,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <div
        className="border border-gray border-solid m-4 p-4"
        style={{ width: 'calc(400px + 4rem)' }}
      >
        {storyFn()}
      </div>
    ),
  ],
}

const config: MatchFormConfig = {
  groups: [
    {
      id: 1,
      name: 'Lorem',
    },
    {
      id: 2,
      name: 'Ipsum',
    },
  ],
  fields: [
    {
      id: 1,
      groupId: 1,
      type: 'age',
      name: 'age',
      label: "What is the patient's current age (in years)?",
      min: 0,
      relevant: true,
    },
    {
      id: 3,
      groupId: 1,
      type: 'radio',
      name: 'sex',
      label: "What is the patient's biological sex?",
      options: [
        { value: 1, label: 'Male', description: '' },
        { value: 2, label: 'Female', description: '' },
      ],
      relevant: true,
    },
    {
      id: 2,
      groupId: 1,
      type: 'number',
      name: 'weight',
      label: "What is the patient's current weight (in kg)?",
      min: 0,
      step: 0.1,
      relevant: true,
    },
    {
      id: 4,
      groupId: 2,
      type: 'select',
      name: 'diagnosis',
      label: "What is the patient's current diagnosis?",
      options: [
        {
          value: 6,
          label: 'Acute promyelocytic leukemia (APL)',
        },
        {
          value: 7,
          label: 'Acute myeloid leukemia (AML)',
        },
        {
          value: 8,
          label: 'Down syndrome acute myeloid leukemia (DS AML)',
        },
        {
          value: 9,
          label: 'B-cell acute lymphoblastic leukemia (B-ALL)',
        },
        {
          value: 10,
          label: 'Juvenile myelomonocytic leukemia (JMML)',
        },
        {
          value: 11,
          label: 'Mixed-phenotype acute leukemia (MPAL)',
        },
        {
          value: 12,
          label: 'Myelodysplastic syndromes (MDS)',
        },
        {
          value: 13,
          label: 'Myelodysplastic syndrome (MDS) who have progressed to AML',
        },
        {
          value: 14,
          label: 'Treatment-related acute myeloid leukemia (tAML)',
        },
        {
          value: 15,
          label: 'T-cell acute lymphoblastic leukemia (T-ALL)',
        },
        {
          value: 16,
          label: 'Acute lymphoblastic leukemia (ALL)',
        },
        {
          value: 17,
          label: 'KMT2A acute lymphoblastic leukemia',
        },
        {
          value: 18,
          label:
            'Early T-cell precursor acute lymphoblastic leukemia (ETP-ALL)',
        },
        {
          value: 59,
          label: 'Ambiguous lineage acute leukemia (ALAL)',
        },
      ],
      placeholder: 'Select',
      relevant: true,
    },
    {
      id: 5,
      groupId: 2,
      type: 'radio',
      name: 'ever_refractory',
      label:
        'Does the patient currently have, or have they in the past had, refractory disease?',
      options: [
        { value: 3, label: 'Yes', description: '' },
        { value: 4, label: 'No', description: '' },
        { value: 5, label: 'Not sure', description: '' },
      ],
      relevant: true,
    },
  ],
}

const matchInput: MatchFormValues = {}

export const defaultView: React.FC = () => (
  <MatchForm
    config={config}
    matchInput={matchInput}
    isFilterActive={false}
    updateMatchInput={action('updateMatchInput')}
    setIsUpdating={action('isUpdating')}
    importantQuestionsConfig={{ groups: [] }}
  />
)
