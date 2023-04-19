import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import draw from '../draw'
import getLowestTime from '../get/lowestTime'
import guardScheme from '../guard/scheme'

export default function effectFour ({
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
  const firstEvent = createEvent('First, you take 1 Privilege into your hand.')
  const privelege = guardScheme({ rank: 1 })
  const bankHand = [...hand, privelege]
  const lowestTime = getLowestTime(playSchemes)
  const timeEvent = createEvent(`The lowest time in play is ${lowestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand,
    drawEvents
  } = draw({
    deck,
    discard,
    hand: bankHand,
    depth: lowestTime
  })
  const secondChildren = [timeEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the lowest time in play.', secondChildren)
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
