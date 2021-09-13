import WarningIcon from '../assets/warning-24px.svg'

function WarningBanner() {
  return (
    <div className="bg-primary font-bold text-sm text-white text-center p-2">
      <img className="mr-2 inline" src={WarningIcon} alt="warning icon" /> This
      site is intended for pilot use only at this time and matching results
      should not be used for eligibility assessment of actual patients.
    </div>
  )
}

export default WarningBanner
