import { SchemeEffectProps } from '../types'
import { createSchemeRef } from '../create/schemeRef'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'
import draw from '../draw'
import getLowestTime from '../get/lowestTime'

export default function effectFour ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
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
    deck: playerData.deck,
    discard: playerData.deck,
    hand: bankHand,
    depth: lowestTime
  })
  const secondChildren = [timeEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the lowest time in play.', secondChildren)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
