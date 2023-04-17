import { SchemeEffectProps, SchemeResult } from '../types'
import { createEvent } from '../create/event'
import { increment } from 'firelord'
import guardSchemeData from '../guard/schemeData'
import guardDefined from '../guard/defined'
import getLowestRankSchemeInPlay from '../get/lowestRankSchemeInPlay'

export default function effectSeven ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  let gold = 0
  const firstChildren = []
  function isSame (): boolean {
    const leftTwo = passedTimeline.slice(0, 2)
    if (leftTwo.length < 2) return false
    const colors = leftTwo.map(scheme => guardSchemeData(scheme.rank).color)
    return colors.every(color => color === colors[0])
  }
  const same = isSame()
  if (same) {
    firstChildren.push(createEvent('The left 2 timeline schemes are the same color.'))
    const leftRank = guardDefined(passedTimeline[0], 'Left timeline').rank
    firstChildren.push(createEvent(`The left timeline scheme is ${leftRank}, so you earn ${leftRank} gold.`))
    gold += leftRank
  } else {
    firstChildren.push(createEvent('The left 2 timeline schemes are not the same color.'))
  }
  const firstEvent = createEvent('First, if the left 2 timeline schemes are the same color, you earn the higher rank', firstChildren)
  const lowest = getLowestRankSchemeInPlay(allPlayers)
  const lowestMessage = `The lowest rank scheme in play is ${lowest.rank}.`
  const secondChildren = [createEvent(lowestMessage)]
  if (lowest.color === 'green') {
    const goldEvent = createEvent(`${lowestMessage}, which is green, so you earn 10 gold.`)
    secondChildren.push(goldEvent)
    gold += 10
  } else {
    const goldEvent = createEvent(`${lowestMessage}, which is not green.`)
    secondChildren.push(goldEvent)
  }
  const secondEvent = createEvent('Second, if the lowest rank scheme in play is green, earn 10 gold', secondChildren)
  return {
    hand,
    profileChanges: {
      gold: increment(gold)
    },
    playerEvents: [firstEvent, secondEvent]
  }
}
