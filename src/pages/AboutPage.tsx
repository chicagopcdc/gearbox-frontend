import type React from 'react'
import LinkExternal from '../components/LinkExternal'
import './AboutPage.css'

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
        clinicians near-instant matching to open trials for their patients
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

function AboutPage() {
  return (
    <div className="my-8 text-lg">
      <h1 className="font-bold text-primary text-3xl mb-8">About GEARBOx</h1>
      <AboutPageSplash />
      <AboutPageSection>
        <p className="mb-4">
          There are currently limited resources for a clinician to match their
          patients against open clinical trials.{' '}
          <em className="font-bold not-italic text-primary">
            GEARBOx aims to solve that by providing clinicians near-instant
            matching to open trials
          </em>
          , based on their patient’s clinical and genomic testing, and
          information abstracted from the trial protocol. The clinician is also
          provided with information to help facilitate the enrollment of the
          patients on the trial.
        </p>
        <p>
          GEARBOx is developed by the University of Chicago’s Data for the
          Common Good (D4CG) team with funding from the{' '}
          <span className="font-bold">Leukemia & Lymphoma Society</span> (LLS)
          as part of PedAL: Precision Medicine for Pediatric Acute Leukemia
          initiative,{' '}
          <span className="font-bold">
            The Fund for Innovation in Cancer Informatics
          </span>{' '}
          (ICI) and the{' '}
          <span className="font-bold">National Cancer Institute</span> (NCI).
        </p>
      </AboutPageSection>
      <AboutPageSection title="Who is GEARBOx for?">
        <p>
          GEARBOx is a decision-support tool used by{' '}
          <em className="font-bold not-italic text-primary">
            clinicians and nurse navigators
          </em>{' '}
          to identify potential clinical trials for their patients. It is a rich
          resource for clinicians to explore the landscape of available clinical
          trials and also be able to match patients to Phase I/II trials.
        </p>
      </AboutPageSection>
      <AboutPageSection title="What information is available on GEARBOX?">
        <p>
          GEARBOx contains eligibility criteria, including inclusion and
          exclusion criteria, abstracted from trial protocols. Location
          information and enrollment status are obtained from{' '}
          <LinkExternal
            className="underline text-primary"
            to="https://clinicaltrials.gov/"
          >
            ClinicalTrials.gov
          </LinkExternal>{' '}
          and the project sponsors. This information is periodically updated to
          ensure that the records are up to date.
        </p>
      </AboutPageSection>
      <AboutPageSection title="Terms and conditions">
        <p>
          <LinkExternal
            className="underline text-primary"
            to="https://docs.pedscommons.org/GEARBOxTermsandConditions/"
          >
            Read the GEARBOx Terms and Conditions
          </LinkExternal>{' '}
          for appropriate use of information on this site and limitations.
        </p>
      </AboutPageSection>
      <AboutPageSection title="Privacy notice">
        <p>
          <LinkExternal
            className="underline text-primary"
            to="https://docs.pedscommons.org/PcdcPrivacyNotice/"
          >
            Read this Privacy Notice
          </LinkExternal>{' '}
          to find out how Data for the Common Good (D4CG) uses the personal data
          collected from you when you visit the GEARBOx website.
        </p>
      </AboutPageSection>
      <AboutPageSection title="Get regular updates">
        <ul className="list-disc ml-8">
          <li>
            <LinkExternal
              className="underline text-primary"
              to="https://www.lls.org/childrens-initiative/pedal"
            >
              LLS Pedal Initiative
            </LinkExternal>
          </li>
          <li>
            <LinkExternal
              className="underline text-primary"
              to="http://sam.am/PCDCnews"
            >
              Data for the Common Good (D4CG) newsletter
            </LinkExternal>
          </li>
        </ul>
      </AboutPageSection>
      <AboutPageSection>
        <p>
          If you need help with GEARBOx, send an email to{' '}
          <LinkExternal
            className="underline text-primary"
            to="mailto:gearbox_help@lists.uchicago.edu"
          >
            gearbox_help@lists.uchicago.edu
          </LinkExternal>
          .
        </p>
      </AboutPageSection>
    </div>
  )
}

export default AboutPage
