import { arrayUnion } from 'firelord'
import { createEvent } from '../create/event'
import drawMultiple from '../draw/multiple'
import getLowestTime from '../get/lowestTime'
import revive from '../revive'
import { SchemeEffectProps } from '../types'

export default function effectTwo ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const lowestTime = getLowestTime(allPlayers)
  const {
    revivedDiscard,
    revivedHand,
    reviveEvents
  } = revive({
    discard: playerData.discard,
    hand,
    depth: lowestTime
  })
  const timeEvent = createEvent(`The lowest time in play is ${lowestTime}.`)
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent('First, you revive the lowest time in play', firstChildren)
  const { drawnDeck, drawnHand, drawnDiscard } = drawMultiple({
    deck: playerData.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: gameData.dungeon.length
  })
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent)
  })
}
