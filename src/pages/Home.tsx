import React from 'react'
import { Link } from 'react-router-dom'
import Box from '../components/Box'
import Button from '../components/Inputs/Button'
import MatchForm from '../components/MatchForm'
import OpenTrials from '../components/OpenTrials'
import { MatchFormConfig, MatchFormValues, MatchResult, Study } from '../model'

const paragraphs = [
  `A tool built and maintained by the Pediatric Acute Leukemia (PedAL) Group, GEARBOx matches pediatric patients currently on Phase III clinical trials who experience refactory or relapsing disease to new Phase I or Phase II clinical trials based on their personal and clinical data. To see a list of all the trials included in this search, please select "Eligible Trials" above.`,
  `GEARBOx has compiled both a centralized lift of COG-sponsored Phase I and Phase II pediatric acute leukemia trials and a complete index of each study's eligibility criteria. Using these data points, our algorithm matches patients to trials for which they are eligible - streaming the process by which Clinical Research Associates (CRAs) identify and initiate their patients' next step in care.`,
]

type HomeProps = {
  isAuthenticated: boolean
  matchFormProps: {
    config: MatchFormConfig
    initialValues: MatchFormValues
    values: MatchFormValues
    onChange(values: MatchFormValues): void
  }
  matchResult: MatchResult
  studies: Study[]
}

const Home = ({
  isAuthenticated,
  matchFormProps,
  matchResult,
  studies,
}: HomeProps) => (
  <>
    {paragraphs.map((p, i) => (
      <p className="mb-4" key={i}>
        {p}
      </p>
    ))}

    {isAuthenticated ? (
      <div className="mt-16 md:flex">
        <Box
          name="Patient Information"
          outerClassName="md:max-w-3/5"
          innerClassName="px-8"
        >
          <MatchForm {...matchFormProps} />
        </Box>

        <Box
          name="Open Trials"
          outerClassName={`md:flex-grow ${
            matchResult.isLoaded ? '' : 'bg-gray-200'
          }`}
        >
          <OpenTrials matchIds={matchResult.ids} studies={studies} />
        </Box>
      </div>
    ) : (
      <div className="text-center my-8">
        <Link to="/login">
          <Button>Log in to find matching clinical trials</Button>
        </Link>
      </div>
    )}
  </>
)

export default Home
