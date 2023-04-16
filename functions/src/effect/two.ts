import { arrayUnion } from 'firelord'
import { createEvent } from '../create/event'
import getLowestTime from '../get/lowestTime'
import revive from '../revive'
import { SchemeEffectProps } from '../types'
import draw from '../draw'

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
  const { drawnDeck, drawnHand, drawnDiscard, drawEvents } = draw({
    deck: playerData.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: gameData.dungeon.length
  })
  const dungeonEvent = createEvent(`The are ${gameData.dungeon.length} schemes in the dungeon.`)
  const secondChildren = [dungeonEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw the number of schemes in the dungeon', secondChildren)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
