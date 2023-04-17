import createPrivelege from '../create/privelege'
import { SchemeEffectProps, SchemeResult } from '../types'
import getHighestTime from '../get/highestTime'
import draw from '../draw'
import { createEvent } from '../create/event'

export default function effectThree ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  const discardPrivelege = createPrivelege(3)
  const bankDiscard = [...playerResult.discard, ...discardPrivelege]
  const firstEvent = createEvent('First, you put 3 privelege on your discard.')
  const highestTime = getHighestTime(allPlayers)
  const timeEvent = createEvent(`The highest time in play is ${highestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawEvents,
    drawnHand
  } = draw({
    deck: playerResult.deck,
    discard: bankDiscard,
    hand,
    depth: highestTime
  })
  const secondChildren = [timeEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the highest time in play', secondChildren)
  return {
    hand: drawnHand,
    playerChanges: {
      deck: drawnDeck,
      discard: drawnDiscard
    },
    playerEvents: [firstEvent, secondEvent]
  }
}
