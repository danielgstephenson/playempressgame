import { SchemeEffectProps, EffectResult, Choice } from '../types'
import draw from '../draw'
import createEvent from '../create/event'
import createId from '../create/id'

export default function effectOne ({
  summons,
  choices,
  deck,
  discard,
  dungeon,
  copiedByFirstEffect,
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
  if (copiedByFirstEffect === true) {
    trashChoice.first = playSchemeRef
  }
  const trashedChoices = [...choices, trashChoice]
  return {
    effectSummons: summons,
    effectChoices: trashedChoices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
