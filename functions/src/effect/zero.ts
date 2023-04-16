import { arrayUnion } from 'firelord'
import { SchemeEffectProps } from '../types'
import createPrivelege from '../create/privelege'
import { createEvent } from '../create/event'

export default function effectZero ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const firstEvent = createEvent('First, you take 8 Privilege into your hand')
  const drawSchemes = createPrivelege(8)
  const drawnHand = [...hand, ...drawSchemes]

  const secondEvent = createEvent('Second, you put 2 Privilege on your deck')
  const deckSchemes = createPrivelege(2)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: arrayUnion(...deckSchemes),
    history: arrayUnion(firstEvent, secondEvent)
  })
}
