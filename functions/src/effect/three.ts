import createPrivelege from '../create/privelege'
import { SchemeEffectProps, SchemeResult } from '../types'
import draw from '../draw'
import { createEvent } from '../create/event'
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
}: SchemeEffectProps): SchemeResult {
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
    appointments,
    choices,
    deck: drawnDeck,
    discard: drawnDiscard,
    gold,
    hand: drawnHand,
    playerEvents: [firstEvent, secondEvent]
  }
}
