import { SchemeEffectProps, EffectResult } from '../types'
import createPrivilege from '../create/privilege'
import createEvent from '../create/event'

export default function effectZero ({
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
  const firstEvent = createEvent('First, you take 8 Privilege into your hand')
  const drawSchemes = createPrivilege(8)
  const drawnHand = [...hand, ...drawSchemes]

  const secondEvent = createEvent('Second, you put 2 Privilege on your deck')
  const deckSchemes = createPrivilege(2)
  const drawnDeck = [...deck, ...deckSchemes]
  return {
    effectSummons: appointments,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: discard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
