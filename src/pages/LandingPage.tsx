import { Link } from 'react-router-dom'
import LinkButton from '../components/LinkButton'
import LinkExternal from '../components/LinkExternal'
import gearboxLogo from '../assets/gearbox-logo.svg'
import gearIcon from '../assets/gear-icon.svg'
import laptopScreen from '../assets/laptop-screen.png'
import matchScreenshotLeft from '../assets/match-screenshot-left.png'
import matchScreenshotRight from '../assets/match-screenshot-right.png'
import nciClinician from '../assets/nci-clinician.jpg'
import nciPatient from '../assets/nci-patient.jpg'
import pedalBeehives from '../assets/pedal-beehives.png'
import pedalGraphic from '../assets/CI19-pedal-graphic.png'
import nihLogo from '../assets/nih-logo.png'
import iciLogo from '../assets/ici-logo.png'
import './LandingPage.css'

function LandingPageSection1() {
  return (
    <section className="relative overflow-x-hidden px-4">
      <img id="beehive" src={pedalBeehives} alt="Beehive background graphic" />
      <img id="gear-icon" src={gearIcon} alt="Gear icon background graphic" />
      <div className="flex items-center min-h-screen max-w-screen-xl md:mx-auto">
        <div className="w-full">
          <h1 className="leading-tight text-4xl sm:text-5xl lg:text-6xl mb-8">
            Find <strong className="text-primary">clinical trials</strong>
            <br />
            for your <strong className="text-primary">patients</strong>.
            <br />
            Instantly.
          </h1>
          <p className="max-w-xs sm:max-w-md sm:text-lg md:text-xl mr-16 sm:mr-0 mb-16">
            GEARBOx{' '}
            <span className="text-xs text-gray-400">
              Genomic Eligibility AlgoRithm for Better Outcomes
            </span>{' '}
            helps you rapidly match patients with relapsed or refractory disease
            to appropriate clinical trials.
          </p>
          <LinkButton to="/login" size="large">
            Get started
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

function LandingPageSection2() {
  return (
    <section className="min-h-screen flex items-center my-16">
      <div className="w-full text-center">
        <div id="section-2-img-container" className="w-full relative xl:mb-16">
          <img id="gearbox-logo" src={gearboxLogo} alt="GEARBOx logo" />
          <img id="laptop-screen" src={laptopScreen} alt="Void laptop screen" />
          <div id="laptop-screen-bg" />
          <div id="nci-patient-overlay" />
          <img id="nci-patient" src={nciPatient} alt="Cancer patient" />
          <div id="nci-clinician-overlay" />
          <img id="nci-clinician" src={nciClinician} alt="Cancer clinician" />
        </div>
        <h2 className="text-gray-500 text-3xl sm:text-4xl lg:text-5xl mb-8">
          <strong>Connect. Share. Cure.</strong>
        </h2>
        <Link to="/about" className="underline text-primary text-md md:text-xl">
          Learn more about GEARBOx
        </Link>
      </div>
    </section>
  )
}

function LandingPageSection3() {
  return (
    <section className="min-h-screen flex items-center my-16">
      <div className="max-w-screen-xl text-center mx-auto">
        <div className="flex flex-wrap items-center justify-center mb-8 px-4">
          <img
            className="sm:w-4/5 md:w-1/2 lg:2/5"
            src={matchScreenshotLeft}
            alt="Match form screenshot left"
          />
          <img
            className="sm:w-4/5 md:w-1/2 lg:2/5"
            src={matchScreenshotRight}
            alt="Match form screenshot right"
          />
        </div>
      </div>
    </section>
  )
}

function LandingPageSection4({ isLLS }: { isLLS: boolean }) {
  return (
    <>
      <section className="min-h-screen items-center my-16">
        <div className="lg:flex max-w-screen-md lg:max-w-screen-xl mx-auto px-4">
          <div className="mx-auto lg:mx-0 lg:mr-8">
            <h2 className="leading-tight text-4xl md:text-5xl mb-8 lg:mb-16">
              {isLLS
                ? 'Built and maintained by the'
                : 'GEARBOx is supported by:'}{' '}
              <strong>LLS PedAL Initiative</strong>
            </h2>
            <p className="md:text-xl mb-8">
              The Leukemia & Lymphoma Society PedAL initiative is working to
              usher in a new era of treatment for relapsed and refractory
              pediatric leukemias. GEARBOx is part of the data infrastructure
              projects of the PedAL initiative.
            </p>
            <LinkExternal
              className="underline text-primary md:text-xl"
              to="https://www.lls.org/childrens-initiative/pedal"
            >
              Learn more about LLS PedAL initiative
            </LinkExternal>
          </div>
          <div className="mt-12 md:mt-24 mx-auto md:min-w-1/2">
            <img src={pedalGraphic} alt="CI19 PedAL graphic" />
          </div>
        </div>
        {!isLLS && (
          <>
            <div className="max-w-screen-md lg:max-w-screen-xl mx-auto px-4">
              <img src={nihLogo} alt="National Cancer Institute" />
              <a href="https://cancer.gov" className="text-lg">
                cancer.gov
              </a>
            </div>
            <div className="max-w-screen-md lg:max-w-screen-xl mx-auto px-4">
              <img src={iciLogo} alt="Innovation In Cancer Informatics" />
              <a href="https://www.the-ici-fund.org/" className="text-lg">
                The Fund for Innovation in Cancer Informatics (ICI)
              </a>
            </div>
          </>
        )}
      </section>
    </>
  )
}

function LandingPageSection5() {
  return (
    <section className="text-center my-16 md:my-32 px-4">
      <p className="text-xl sm:text-2xl md:text-3xl mb-8">
        Find matching clinical trials with GEARBOx
      </p>
      <LinkButton to="/login" size="large">
        Get started
      </LinkButton>
    </section>
  )
}

function LandingPage({ isLLS }: { isLLS: boolean }) {
  return (
    <>
      <LandingPageSection1 />
      <LandingPageSection2 />
      <LandingPageSection3 />
      <LandingPageSection4 isLLS={isLLS} />
      <LandingPageSection5 />
    </>
  )
}

export default LandingPage
