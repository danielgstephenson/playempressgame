import { SchemeEffectProps, SchemeResult } from '../types'
import draw from '../draw'
import { createEvent } from '../create/event'

export default function effectOne ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  const { drawnDeck, drawnDiscard, drawEvents, drawnHand } = draw({
    deck: playerResult.deck,
    discard: playerResult.discard,
    hand,
    depth: 2
  })
  const firstEvent = createEvent('First, you draw two cards.', drawEvents)
  const secondEvent = createEvent('Second, you must select a scheme from your hand to trash.')
  const playerChanges = {
    deck: drawnDeck,
    discard: drawnDiscard
  }
  const choices = [{ playerId: playerResult.id, type: 'trash' } as const]

  return {
    choices,
    hand: drawnHand,
    playerChanges,
    playerEvents: [firstEvent, secondEvent]
  }
}
