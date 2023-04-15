import { arrayUnion } from 'firelord'
import { SchemeEffectProps } from '../types'
import createPrivelege from '../create/privelege'

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
  const drawSchemes = createPrivelege(8)
  const drawnHand = [...hand, ...drawSchemes]

  const deckSchemes = createPrivelege(2)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: arrayUnion(...deckSchemes)
  })
}
