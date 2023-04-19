import createEvent from '../create/event'
import revive from '../revive'
import { SchemeEffectProps, SchemeResult } from '../types'
import draw from '../draw'
import getLowestTime from '../get/lowestTime'

export default function effectTwo ({
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
  const lowestTime = getLowestTime(playSchemes)
  const {
    revivedDiscard,
    revivedHand,
    reviveEvents
  } = revive({
    discard,
    hand,
    depth: lowestTime
  })
  const timeEvent = createEvent(`The lowest time in play is ${lowestTime}.`)
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent('First, you revive the lowest time in play', firstChildren)
  const { drawnDeck, drawnHand, drawnDiscard, drawEvents } = draw({
    deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: dungeon.length
  })
  const dungeonEvent = createEvent(`There are ${dungeon.length} schemes in the dungeon.`)
  const secondChildren = [dungeonEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the number of schemes in the dungeon', secondChildren)

  return {
    appointments,
    choices,
    deck: drawnDeck,
    discard: drawnDiscard,
    gold,
    hand: drawnHand,
    playerEvents: [firstEvent, secondEvent]
  }
}
