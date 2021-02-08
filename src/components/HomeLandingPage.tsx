import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Inputs/Button'
import './HomeLandingPage.css'

import gearboxLogo from '../assets/gearbox-logo.svg'
import gearIcon from '../assets/gear-icon.svg'
import laptopScreen from '../assets/laptop-screen.png'
import matchScreenshotLeft from '../assets/match-screenshot-left.png'
import matchScreenshotRight from '../assets/match-screenshot-right.png'
import nciClinician from '../assets/nci-clinician.jpg'
import nciPatient from '../assets/nci-patient.jpg'
import pedalBeehives from '../assets/pedal-beehives.png'
import pedalGraphic from '../assets/CI19-pedal-graphic.png'

function HomeLandingSection1() {
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
            Let GEARBOx help you and expedite the process to identify and
            initiate your patients' next step in care.
          </p>
          <Link to="/">
            <Button size="large">Register</Button>
          </Link>
          <p className="mt-4">
            Already a registered user?
            <Link to="/login" className="text-primary underline ml-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function HomeLandingSection2() {
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
        <Link
          to="/about"
          className="block underline text-primary text-md md:text-xl"
        >
          Learn more about GEARBOx
        </Link>
      </div>
    </section>
  )
}

function HomeLandingSection3() {
  return (
    <section className="min-h-screen flex items-center my-16">
      <div className="max-w-screen-xl text-center mx-auto">
        <div className="flex flex-wrap justify-center mb-8 px-4">
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
        <Link
          to="/guide"
          className="block underline text-primary text-md md:text-xl"
        >
          Learn how to use GEARBOx
        </Link>
      </div>
    </section>
  )
}

function HomeLandingSection4() {
  return (
    <section className="min-h-screen flex items-center my-16">
      <div className="lg:flex max-w-screen-md lg:max-w-screen-xl mx-auto px-4">
        <div className="mx-auto lg:mx-0 lg:mr-8">
          <h2 className="leading-tight text-4xl md:text-5xl mb-8 lg:mb-16">
            Built and maintained by the <strong>LLS PedAL</strong> Group
          </h2>
          <p className="md:text-xl mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in
            sollicitudin nisl. Cras elit metus, malesuada gravida elementum ac,
            molestie.
          </p>
          <Link to="/about" className="block underline text-primary md:text-xl">
            Learn more about LLS PedAL initiative
          </Link>
        </div>
        <div className="mt-12 md:mt-24 mx-auto">
          <img src={pedalGraphic} alt="CI19 PedAL graphic" />
        </div>
      </div>
    </section>
  )
}

function HomeLandingSection5() {
  return (
    <section className="text-center my-16 md:my-32 px-4">
      <p className="text-xl sm:text-2xl md:text-3xl mb-8">
        Find matching clinical trials with GEARBOx
      </p>
      <Link to="/">
        <Button size="large">Register</Button>
      </Link>
      <p className="mt-4">
        Already a registered user?
        <Link to="/login" className="text-primary underline ml-2">
          Log in
        </Link>
      </p>
    </section>
  )
}

function HomeLandingPage() {
  return (
    <>
      <HomeLandingSection1 />
      <HomeLandingSection2 />
      <HomeLandingSection3 />
      <HomeLandingSection4 />
      <HomeLandingSection5 />
    </>
  )
}

export default HomeLandingPage
