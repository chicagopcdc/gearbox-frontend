import React from 'react'
import Box from '../Components/Box'

const paragraphs = [
  `A tool built and maintained by the Pediatric Acute Leukemia (PedAL) Group, GEARBOx matches pediatric patients currently on Phase III clinical trials who experience refactory or relapsing disease to new Phase I or Phase II clinical trials based on their personal and clinical data. To see a list of all the trials included in this search, please select "Eligible Trials" above.`,
  `GEARBOx has compiled both a centralized lift of COG-sponsored Phase I and Phase II pediatric acute leukemia trials and a complete index of each study's eligibility criteria. Using these data points, our algorithm matches patients to trials for which they are eligible - streaming the process by which Clinical Research Associates (CRAs) identify and initiate their patients' next step in care.`,
]

const Home = () => {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p className="mb-4" key={i}>
          {p}
        </p>
      ))}

      <div className="mt-16">
        <div className="flex flex-wrap">
          <div className="flex-1">
            <Box name="Patient information">placeholder</Box>
          </div>
          <div className="flex-1">
            <Box name="Biomarker Report Submission">placeholder</Box>
          </div>
        </div>
        <Box name="Clinical Details">placeholder</Box>
      </div>
    </>
  )
}

export default Home
