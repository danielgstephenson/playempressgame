import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import draw from '../draw'
import getHighestTime from '../get/highestTime'

export default function effectSix ({
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
}: SchemeEffectProps): EffectResult {
  const highestTime = getHighestTime(playSchemes)
  const timeEvent = createEvent(`The highest time in play is ${highestTime}.`)
  const { revivedDiscard, revivedHand, reviveEvents } = revive({
    discard,
    hand,
    depth: highestTime
  })
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent('First, you revive the highest time in play', firstChildren)
  const dungeonRanks = dungeon.map(scheme => scheme.rank)
  const lowestDungeon = Math.min(...dungeonRanks)
  const dungeonEvent = createEvent(`The lowest rank in the dungeon is ${lowestDungeon}.`)
  const { drawnDeck, drawnDiscard, drawnHand, drawEvents } = draw({
    deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: lowestDungeon
  })
  const secondChildren = [dungeonEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the lowest rank in the dungeon', secondChildren)
  return {
    effectAppointments: appointments,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent]
  }
}
