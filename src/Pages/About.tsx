import React from 'react'
import Box from '../Components/Box'

const steps = [
  `Study coordinators gather patient information, lab values, flow cytometry, and cytogenetic reports.`,
  `Specific pieces of a patient's clinical information are submitted to the online portal.`,
  `The GEARBOx algorithm filters the patient's information through the eligibility criteria for each pediatric AML trial.`,
  `Study coordinators are given a list of trials for which their patient is eligible, including registration information and contact information for the managing institution`,
]

const About = () => {
  return (
    <Box name="GEARBOx Overview">
      <div className="mx-8">
        <ol className="list-decimal mt-8 mb-16">
          {steps.map((step) => (
            <li className="mb-4">{step}</li>
          ))}
        </ol>

        <img alt="Diagram" />
      </div>
    </Box>
  )
}

export default About
