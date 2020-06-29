import React from 'react'
import Button from '../Components/Inputs/Button'
import MatchForm from '../Components/MatchForm'
import { Link, useHistory } from 'react-router-dom'

const paragraphs = [
  `A tool built and maintained by the Pediatric Acute Leukemia (PedAL) Group, GEARBOx matches pediatric patients currently on Phase III clinical trials who experience refactory or relapsing disease to new Phase I or Phase II clinical trials based on their personal and clinical data. To see a list of all the trials included in this search, please select "Eligible Trials" above.`,
  `GEARBOx has compiled both a centralized lift of COG-sponsored Phase I and Phase II pediatric acute leukemia trials and a complete index of each study's eligibility criteria. Using these data points, our algorithm matches patients to trials for which they are eligible - streaming the process by which Clinical Research Associates (CRAs) identify and initiate their patients' next step in care.`,
]

type HomeProps = {
  isAuthenticated: boolean
  onMatchSubmit(values: any): void
}

const Home = ({ isAuthenticated, onMatchSubmit }: HomeProps) => {
  const history = useHistory()
  const handleSubmit = (values: any) => {
    const newValues = {
      priorTreatmentTherapies: values.priorTreatmentTherapies,
      organFunction: values.organFunction,
      prevChemo: values.prevChemo,
      prevRad: values.prevRad,
      biomarkers: values.biomarkers,
    }

    if (process.env.NODE_ENV === 'development') {
      const confirmed = window.confirm(JSON.stringify(values, null, 2))
      if (confirmed) {
        onMatchSubmit(newValues)
        history.replace('/results')
      }
    } else {
      onMatchSubmit(newValues)
      history.replace('/results')
    }
  }

  return (
    <>
      {paragraphs.map((p, i) => (
        <p className="mb-4" key={i}>
          {p}
        </p>
      ))}

      {isAuthenticated ? (
        <MatchForm onSubmit={handleSubmit} />
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
