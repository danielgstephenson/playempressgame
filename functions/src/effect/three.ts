import createPrivelege from '../create/privelege'
import { SchemeEffectProps, EffectResult } from '../types'
import draw from '../draw'
import createEvent from '../create/event'
import getHighestTime from '../get/highestTime'
import addEvent from '../addEvent'

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
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, you put 3 privelege on your discard.')
  const discardPrivelege = createPrivelege(3)
  const bankDiscard = [...discard, ...discardPrivelege]
  const secondEvent = createEvent('Second, you draw the highest time in play')
  const highestTime = getHighestTime(playSchemes)
  addEvent(secondEvent, `The highest time in play is ${highestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand
  } = draw({
    deck,
    discard: bankDiscard,
    event: secondEvent,
    hand,
    depth: highestTime
  })
  return {
    effectAppointments: appointments,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
