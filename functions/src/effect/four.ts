import { SchemeEffectProps, SchemeResult } from '../types'
import { createSchemeRef } from '../create/schemeRef'
import { createEvent } from '../create/event'
import draw from '../draw'
import getLowestTime from '../get/lowestTime'

export default function effectFour ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  const firstEvent = createEvent('First, you take 1 Privilege into your hand.')
  const privelege = createSchemeRef(1)
  const bankHand = [...hand, privelege]
  const lowestTime = getLowestTime(allPlayers)
  const timeEvent = createEvent(`The lowest time in play is ${lowestTime}.`)
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand,
    drawEvents
  } = draw({
    deck: playerResult.deck,
    discard: playerResult.deck,
    hand: bankHand,
    depth: lowestTime
  })
  const secondChildren = [timeEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the lowest time in play.', secondChildren)
  return {
    hand: drawnHand,
    playerChanges: {
      deck: drawnDeck,
      discard: drawnDiscard
    },
    playerEvents: [firstEvent, secondEvent]
  }
}
