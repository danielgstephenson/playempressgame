import { SchemeEffectProps, SchemeResult } from '../types'
import createPrivelege from '../create/privelege'
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
  playSchemes
}: SchemeEffectProps): SchemeResult {
  const firstEvent = createEvent('First, you take 8 Privilege into your hand')
  const drawSchemes = createPrivelege(8)
  const drawnHand = [...hand, ...drawSchemes]

  const secondEvent = createEvent('Second, you put 2 Privilege on your deck')
  const deckSchemes = createPrivelege(2)
  const drawnDeck = [...deck, ...deckSchemes]
  return {
    effectAppointments: appointments,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: discard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent]
  }
}
