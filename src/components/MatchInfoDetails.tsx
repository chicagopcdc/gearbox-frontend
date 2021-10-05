import type { MatchInfo, MatchInfoAlgorithm } from '../model'
import MatchInfoString from './MatchInfoString'

type MatchInfoDetailsProps = {
  matchInfoAlgorithm: MatchInfoAlgorithm
  matchInfoId?: string
  level?: number
}

function MatchInfoDetails({
  matchInfoAlgorithm,
  matchInfoId = 'match-info',
  level = 0,
}: MatchInfoDetailsProps) {
  const { criteria, operator } = matchInfoAlgorithm
  const space = 8
  return (
    <span>
      {criteria.map((crit, i) => (
        <span key={`${matchInfoId}-${level}-${i}`}>
          {level > 0 && i === 0 && (
            <>
              <span className="whitespace-pre">
                {' '.repeat((level - 1) * space) + '('}
              </span>
              <br />
            </>
          )}
          {i > 0 && (
            <>
              <span className="text-gray-500 italic"> {operator}</span>
              <br />
            </>
          )}
          {Object.prototype.hasOwnProperty.call(crit, 'fieldName') ? (
            <>
              <span className="whitespace-pre">
                {' '.repeat(level * space)}
              </span>
              <MatchInfoString {...(crit as MatchInfo)} />
            </>
          ) : (
            <MatchInfoDetails
              matchInfoId={matchInfoId}
              matchInfoAlgorithm={crit as MatchInfoAlgorithm}
              level={level + 1}
            />
          )}
          {level > 0 && i === criteria.length - 1 && (
            <>
              <br />
              <span className="whitespace-pre">
                {' '.repeat((level - 1) * space) + ')'}
              </span>
            </>
          )}
        </span>
      ))}
    </span>
  )
}

export default MatchInfoDetails
