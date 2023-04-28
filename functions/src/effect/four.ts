import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import draw from '../draw'
import getLowestTime from '../get/lowestTime'
import guardScheme from '../guard/scheme'
import addEvent from '../addEvent'

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
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, you take 1 Privilege into your hand.')
  const privilege = guardScheme({ rank: 1 })
  const bankHand = [...hand, privilege]
  const secondEvent = createEvent('Second, you draw the lowest time in play.')
  const lowestTime = getLowestTime(playSchemes)
  addEvent(secondEvent, `The lowest time in play is ${lowestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand
  } = draw({
    deck,
    discard,
    event: secondEvent,
    hand: bankHand,
    depth: lowestTime
  })
  return {
    effectSummons: appointments,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
