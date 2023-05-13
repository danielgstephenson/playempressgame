import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import draw from '../draw'
import getTopScheme from '../get/topScheme'
import addEvent from '../add/event'
import isGreen from '../is/green'
import getLowestRankScheme from '../get/lowestRankScheme'
import getHighestRankScheme from '../get/highestRankScheme'

export default function effectTwentyThree ({
  summons,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if your top discard scheme is green, revive 5.')
  const top = getTopScheme(discard)
  const topGreen = isGreen(top)
  if (top == null) {
    addEvent(firstEvent, 'Your discard is empty.')
  } else {
    const topColor = String(top?.color)
    addEvent(firstEvent, `Your top discard scheme, ${top.rank}, is ${topColor}.`)
  }
  const topDepth = topGreen ? 5 : 0
  const { revivedDiscard, revivedHand } = revive({
    discard,
    event: firstEvent,
    hand,
    depth: topDepth
  })
  const secondEvent = createEvent('Second, if the highest or lowest rank scheme in play is green, draw 5.')
  const lowestScheme = getLowestRankScheme(playSchemes)
  const lowestRank = String(lowestScheme?.rank)
  const lowestColor = String(lowestScheme?.color)
  addEvent(secondEvent, `The lowest rank scheme in play, ${lowestRank}, is ${lowestColor}.`)
  const highestScheme = getHighestRankScheme(playSchemes)
  const highestRank = String(highestScheme?.rank)
  const highestColor = String(highestScheme?.color)
  addEvent(secondEvent, `The highest rank scheme in play, ${highestRank}, is ${highestColor}.`)
  const lowestGreen = isGreen(lowestScheme)
  const highestGreen = isGreen(highestScheme)
  const playDepth = (lowestGreen || highestGreen) ? 5 : 0
  const { drawnDeck, drawnDiscard, drawnHand } = draw({
    deck,
    discard: revivedDiscard,
    event: secondEvent,
    hand: revivedHand,
    depth: playDepth
  })
  return {
    effectSummons: summons,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
