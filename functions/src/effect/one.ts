import { arrayUnion } from 'firelord'
import drawMultiple from '../draw/multiple'
import { SchemeEffectProps } from '../types'

export default function effectOne ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const { drawnDeck, drawnDiscard, drawnList } = drawMultiple({
    deck: playerData.deck,
    discard: playerData.discard,
    drawList: [],
    depth: 2
  })
  const drawnHand = [...hand, ...drawnList]

  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard
  })
  transaction.update(gameRef, {
    choices: arrayUnion({ playerId: playerRef.id, type: 'trash' } as const)
  })
}
