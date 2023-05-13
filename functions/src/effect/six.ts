import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import draw from '../draw'
import getHighestTime from '../get/highestTime'
import addEvent from '../add/event'
import getLowestRankScheme from '../get/lowestRankScheme'

export default function effectSix ({
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
  const firstEvent = createEvent('First, you revive the highest time in play')
  const highestTime = getHighestTime(playSchemes)
  addEvent(firstEvent, `The highest time in play is ${highestTime}.`)
  const { revivedDiscard, revivedHand } = revive({
    discard,
    event: firstEvent,
    hand,
    depth: highestTime
  })
  const secondEvent = createEvent('Second, you draw the lowest rank in the dungeon')
  const lowestDungeon = getLowestRankScheme(dungeon)
  if (dungeon.length === 0) {
    addEvent(secondEvent, 'The dungeon is empty.')
  } else {
    const lowestRank = String(lowestDungeon?.rank)
    addEvent(secondEvent, `The lowest rank in the dungeon is ${lowestRank}.`)
  }
  const { drawnDeck, drawnDiscard, drawnHand } = draw({
    deck,
    discard: revivedDiscard,
    event: secondEvent,
    hand: revivedHand,
    depth: lowestDungeon?.rank
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
