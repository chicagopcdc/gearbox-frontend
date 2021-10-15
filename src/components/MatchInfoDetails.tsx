import type { MatchInfo, MatchInfoAlgorithm } from '../model'
import MatchInfoString from './MatchInfoString'

type MatchInfoDetailsProps = {
  isFilterActive?: boolean
  isHighlightActive?: boolean
  matchInfoAlgorithm: MatchInfoAlgorithm
  matchInfoId?: string
  level?: number
}

function MatchInfoDetails({
  isFilterActive = false,
  isHighlightActive = false,
  matchInfoAlgorithm,
  matchInfoId = 'match-info',
  level = 0,
}: MatchInfoDetailsProps) {
  const { criteria, operator, isMatched } = matchInfoAlgorithm
  const space = 8
  const className =
    !isHighlightActive || isMatched === undefined
      ? ''
      : isMatched
      ? 'bg-blue-100'
      : 'bg-red-100'
  return isFilterActive && isMatched === false ? null : (
    <span className={className}>
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
          {i > 0 &&
            (isFilterActive &&
            (crit.isMatched === false ||
              criteria
                .slice(0, i)
                .every((c) => c.isMatched === false)) ? null : (
              <>
                <span className="text-gray-500 italic"> {operator}</span>
                <br />
              </>
            ))}
          {Object.prototype.hasOwnProperty.call(crit, 'criteria') ? (
            <MatchInfoDetails
              isFilterActive={isFilterActive}
              isHighlightActive={isHighlightActive}
              matchInfoId={matchInfoId}
              matchInfoAlgorithm={crit as MatchInfoAlgorithm}
              level={level + 1}
            />
          ) : (
            <>
              <span className="whitespace-pre">
                {' '.repeat(level * space)}
              </span>
              <MatchInfoString
                {...(crit as MatchInfo)}
                isFilterActive={isFilterActive}
              />
            </>
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
