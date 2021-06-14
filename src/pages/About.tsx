import type React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

function AboutPageSplash() {
  return (
    <section
      id="about-page-splash"
      className="hidden sm:flex relative items-center mb-8"
    >
      <p
        className="hidden sm:block text-4xl md:text-5xl p-4"
        style={{ maxWidth: '66%', lineHeight: '1.375em' }}
      >
        <span className="text-primary font-bold">GEARBOx</span> provides
        clinicians near-instant matching to open trial for their patients
      </p>
    </section>
  )
}

function AboutPageSection({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <section className="mb-8">
      {title && (
        <h2 className="font-bold text-primary text-2xl mb-4">{title}</h2>
      )}
      {children}
    </section>
  )
}

function About() {
  return (
    <div className="my-8 text-lg">
      <h1 className="font-bold text-primary text-3xl mb-8">About GEARBOx</h1>
      <AboutPageSplash />
      <AboutPageSection>
        <p className="mb-4">
          There are currently limited resources for a clinician to match their
          acute myelogenous leukemia (AML) patients against open clinical trials
          for relapsed or refractory disease.{' '}
          <em className="font-bold not-italic text-primary">
            GEARBOx aims to solve that by providing clinicians near-instant
            matching to open trials
          </em>
          , based on their patient’s clinical and genomic testing and
          information abstracted from the trial protocol. The clinician is also
          provided with information to help facilitate the enrollment of the
          child on the trial.
        </p>
        <p className="mb-4">
          GEARBOx is developed by the University of Chicago’s Pediatric Cancer
          Data Commons (PCDC) team with funding from the Leukemia & Lymphoma
          Society (LLS) as part of PedAL: Precision Medicine for Pediatric Acute
          Leukemia initiative.
        </p>
      </AboutPageSection>
      <AboutPageSection title="Who is GEARBOx for?">
        <p className="mb-4">
          GEARBOx is a decision-support tool that is meant for use by{' '}
          <em className="font-bold not-italic text-primary">
            clinicians and nurse navigators
          </em>{' '}
          to identify potential clinical trials to enroll their patients. It is
          a rich resource for clinicians to explore the landscape of available
          clinical trials and also be able to match children to Phase I/II
          trials.
        </p>
      </AboutPageSection>
      <AboutPageSection title="What information is available on GEARBOX?">
        <p className="mb-4">
          GEARBOx will include LLS-sponsored trials in its initial rollout, and
          will expand to include trials from other sponsors. Eligibility
          criteria, including inclusion and exclusion criteria, will be
          abstracted from the trial protocols. Location information and
          enrollment status will be obtained from{' '}
          <a
            className="underline text-primary"
            href="https://clinicaltrials.gov/"
            target="_blank"
            rel="noreferrer"
          >
            ClinicalTrials.gov
          </a>{' '}
          and the project sponsors. This information will be periodically
          updated to ensure that the records are up to date.
        </p>
      </AboutPageSection>
      <AboutPageSection title="Terms and conditions">
        <p className="mb-4">
          <Link className="underline text-primary" to="/terms">
            Read the GEARBOx Terms and Conditions
          </Link>{' '}
          for appropriate use of information on this site and limitations.
        </p>
      </AboutPageSection>
      <AboutPageSection title="Get regular updates">
        <ul className="list-disc ml-8">
          <li>
            <a
              className="underline text-primary"
              href="https://www.lls.org/childrens-initiative/pedal"
              target="_black"
              rel="noopenner"
            >
              LLS Pedal Initiative
            </a>
          </li>
          <li>
            <a
              className="underline text-primary"
              href="http://sam.am/PCDCnews"
              target="_black"
              rel="noopenner"
            >
              Pediatric Cancer Data Commons newsletter
            </a>
          </li>
        </ul>
      </AboutPageSection>
    </div>
  )
}

export default About
