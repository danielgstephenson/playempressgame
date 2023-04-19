import { SchemeEffectProps, SchemeResult } from '../types'
import createEvent from '../create/event'
import guardSchemeData from '../guard/schemeData'
import guardDefined from '../guard/defined'
import getLowestRankScheme from '../get/lowestRankScheme'
import isGreen from '../is/green'

export default function effectSeven ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes
}: SchemeEffectProps): SchemeResult {
  let effectGold = gold
  const firstChildren = []
  function isSame (): boolean {
    const leftTwo = passedTimeline.slice(0, 2)
    if (leftTwo.length < 2) return false
    const colors = leftTwo.map(scheme => guardSchemeData(scheme.rank).color)
    return colors.every(color => color === colors[0])
  }
  const same = isSame()
  if (same) {
    firstChildren.push(createEvent('The left two timeline schemes are the same color.'))
    const leftRank = guardDefined(passedTimeline[0], 'Left timeline').rank
    firstChildren.push(createEvent(`The left timeline scheme is ${leftRank}, so you earn ${leftRank} gold.`))
    effectGold += leftRank
  } else {
    firstChildren.push(createEvent('The left two timeline schemes are not the same color.'))
  }
  const firstEvent = createEvent('First, if the left two timeline schemes are the same color, you earn the higher rank', firstChildren)
  const lowest = getLowestRankScheme(playSchemes)
  const lowestRank = String(lowest?.rank)
  const lowestMessage = `The lowest rank scheme in play is ${lowestRank}`
  const secondChildren = [createEvent(lowestMessage)]
  const green = isGreen(lowest)
  if (green) {
    const goldEvent = createEvent(`${lowestRank} is green, so you earn 10 gold.`)
    secondChildren.push(goldEvent)
    effectGold += 10
  } else {
    const goldEvent = createEvent(`${lowestRank} is not green.`)
    secondChildren.push(goldEvent)
  }
  const secondEvent = createEvent('Second, if the lowest rank scheme in play is green, earn 10 gold', secondChildren)
  return {
    effectAppointments: appointments,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectHand: hand,
    effectGold,
    effectPlayerEvents: [firstEvent, secondEvent]
  }
}
