import drawMultiple from '../draw/multiple'
import createPrivelege from '../create/privelege'
import { SchemeEffectProps } from '../types'
import getHighestTime from '../get/highestTime'

export default function effectThree ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const discardPrivelege = createPrivelege(3)
  const bankDiscard = [...playerData.discard, ...discardPrivelege]
  const highestTime = getHighestTime(allPlayers)
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand
  } = drawMultiple({
    deck: playerData.deck,
    discard: bankDiscard,
    hand,
    depth: highestTime
  })
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard
  })
}
