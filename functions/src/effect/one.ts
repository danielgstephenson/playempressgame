import { SchemeEffectProps, SchemeResult } from '../types'
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
  playSchemes
}: SchemeEffectProps): SchemeResult {
  const {
    drawnDeck,
    drawnDiscard,
    drawEvents,
    drawnHand
  } = draw({ deck, discard, hand, depth: 2 })
  const firstEvent = createEvent('First, you draw two cards.', drawEvents)
  const secondEvent = createEvent('Second, you must select a scheme from your hand to trash.')
  const trashChoice = { playerId, type: 'trash' } as const
  const trashedChoices = [...choices, trashChoice]
  return {
    effectAppointments: appointments,
    effectChoices: trashedChoices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent]
  }
}
