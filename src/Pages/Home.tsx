import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Button from '../components/Inputs/Button'
import MatchForm from '../components/MatchForm'
import MatchedTrials from '../components/MatchedTrials'
import { MatchFormValues, MatchResult } from '../types'

const paragraphs = [
  `A tool built and maintained by the Pediatric Acute Leukemia (PedAL) Group, GEARBOx matches pediatric patients currently on Phase III clinical trials who experience refactory or relapsing disease to new Phase I or Phase II clinical trials based on their personal and clinical data. To see a list of all the trials included in this search, please select "Eligible Trials" above.`,
  `GEARBOx has compiled both a centralized lift of COG-sponsored Phase I and Phase II pediatric acute leukemia trials and a complete index of each study's eligibility criteria. Using these data points, our algorithm matches patients to trials for which they are eligible - streaming the process by which Clinical Research Associates (CRAs) identify and initiate their patients' next step in care.`,
]

type HomeProps = {
  isAuthenticated: boolean
  onMatchChange(values: MatchFormValues): void
  onMatchSubmit(values: MatchFormValues): void
  matchFormValues: MatchFormValues
  matchResult: MatchResult
}

const Home = ({
  isAuthenticated,
  onMatchChange,
  onMatchSubmit,
  matchFormValues,
  matchResult,
}: HomeProps) => {
  const history = useHistory()
  const handleSubmit = (values: MatchFormValues) => {
    if (process.env.NODE_ENV === 'development') {
      const confirmed = window.confirm(JSON.stringify(values, null, 2))
      if (!confirmed) return
    }

    onMatchSubmit(values)
    history.replace('/results')
  }

  const handleChange = onMatchChange

  return (
    <>
      {paragraphs.map((p, i) => (
        <p className="mb-4" key={i}>
          {p}
        </p>
      ))}

      {isAuthenticated ? (
        <div className="mt-16 md:flex">
          <MatchForm
            values={matchFormValues}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <MatchedTrials
            data={matchResult.trials}
            className={`md:flex-grow ${
              matchResult.isLoaded ? '' : 'bg-gray-200'
            }`}
          />
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
}

export default Home
