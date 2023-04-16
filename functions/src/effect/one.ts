import { arrayUnion } from 'firelord'
import { SchemeEffectProps } from '../types'
import draw from '../draw'
import { createEvent } from '../create/event'

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
  const { drawnDeck, drawnDiscard, drawEvents, drawnHand } = draw({
    deck: playerData.deck,
    discard: playerData.discard,
    hand,
    depth: 2
  })
  const firstEvent = createEvent('First, you draw two cards.', drawEvents)
  const secondEvent = createEvent('Second, you must select a scheme from your hand to trash.')
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
  transaction.update(gameRef, {
    choices: arrayUnion({ playerId: playerRef.id, type: 'trash' } as const)
  })
}
