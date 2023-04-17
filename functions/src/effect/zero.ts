import { arrayUnion } from 'firelord'
import { SchemeEffectProps, SchemeResult } from '../types'
import createPrivelege from '../create/privelege'
import { createEvent } from '../create/event'

export default function effectZero ({
  allPlayers,
  playerResult,
  gameData,
  hand,
  passedTimeline
}: SchemeEffectProps): SchemeResult {
  const firstEvent = createEvent('First, you take 8 Privilege into your hand')
  const drawSchemes = createPrivelege(8)
  const drawnHand = [...hand, ...drawSchemes]

  const secondEvent = createEvent('Second, you put 2 Privilege on your deck')
  const deckSchemes = createPrivelege(2)
  return {
    hand: drawnHand,
    playerChanges: {
      deck: arrayUnion(...deckSchemes)
    },
    playerEvents: [firstEvent, secondEvent]
  }
}
