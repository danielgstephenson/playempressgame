import { SchemeEffectProps, EffectResult, Choice } from '../types'
import draw from '../draw'
import createEvent from '../create/event'
import createId from '../create/id'

export default function effectOne ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  first,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemeRef,
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
  const trashChoice: Choice = { id: createId(), playerId, type: 'trash' } as const
  if (first === true) {
    trashChoice.first = playSchemeRef
  }
  const trashedChoices = [...choices, trashChoice]
  return {
    effectSummons: appointments,
    effectChoices: trashedChoices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
