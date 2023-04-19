import createPrivelege from '../create/privelege'
import { SchemeEffectProps, EffectResult } from '../types'
import draw from '../draw'
import createEvent from '../create/event'
import getHighestTime from '../get/highestTime'

export default function effectThree ({
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
  const discardPrivelege = createPrivelege(3)
  const bankDiscard = [...discard, ...discardPrivelege]
  const firstEvent = createEvent('First, you put 3 privelege on your discard.')
  const highestTime = getHighestTime(playSchemes)
  const timeEvent = createEvent(`The highest time in play is ${highestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawEvents,
    drawnHand
  } = draw({
    deck,
    discard: bankDiscard,
    hand,
    depth: highestTime
  })
  const secondChildren = [timeEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the highest time in play', secondChildren)
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
