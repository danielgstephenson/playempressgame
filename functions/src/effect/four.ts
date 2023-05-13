import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import draw from '../draw'
import guardLowestTime from '../guard/lowestTime'
import guardScheme from '../guard/scheme'
import addEvent from '../add/event'

export default function effectFour ({
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
  const firstEvent = createEvent('First, you take 1 Privilege into your hand.')
  const privilege = guardScheme({ rank: 1 })
  const bankHand = [...hand, privilege]
  const secondEvent = createEvent('Second, you draw the lowest time in play.')
  const lowestTime = guardLowestTime(playSchemes)
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
