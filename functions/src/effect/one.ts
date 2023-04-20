import { SchemeEffectProps, EffectResult } from '../types'
import draw from '../draw'
import createEvent from '../create/event'

export default function effectOne ({
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
  const firstEvent = createEvent('First, you draw two cards.')
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand
  } = draw({
    deck,
    discard,
    event: firstEvent,
    hand,
    depth: 2
  })
  const secondEvent = createEvent('Second, you trash a scheme from your hand.')
  const trashChoice = { playerId, type: 'trash' } as const
  const trashedChoices = [...choices, trashChoice]
  return {
    effectAppointments: appointments,
    effectChoices: trashedChoices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
