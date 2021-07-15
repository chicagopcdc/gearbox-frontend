import TrialCard from '../components/TrialCard'
import type { Study } from '../model'

function TrialsPage({ studies }: { studies?: Study[] }) {
  return (
    <div className="my-8 text-lg">
      <h1 className="font-bold text-primary text-3xl mb-8">
        Open clinical trials
      </h1>
      <div>
        {(studies || []).map((study, i) => (
          <TrialCard study={study} key={i}></TrialCard>
        ))}
      </div>
    </div>
  )
}

export default TrialsPage
