import WarningIcon from '../assets/warning-24px.svg'

function WarningBanner() {
  return (
    <div className="bg-primary font-bold text-sm text-white text-center p-2">
      <img className="mr-2 inline" src={WarningIcon} alt="warning icon" /> This
      site is a prototype created for demo purposes only.
    </div>
  )
}

export default WarningBanner
