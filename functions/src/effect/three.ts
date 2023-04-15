import drawMultiple from '../draw/multiple'
import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import createPrivelege from '../create/privelege'
import { SchemeEffectProps } from '../types'

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
  const allTimes = allPlayers.map(player => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    const time = guardTime(playScheme.rank)
    return time
  })
  const maximiumTime = Math.max(...allTimes)
  const {
    drawnDeck,
    drawnDiscard,
    drawnList
  } = drawMultiple({
    deck: playerData.deck,
    discard: bankDiscard,
    drawList: [],
    depth: maximiumTime
  })
  const drawnHand = [...hand, ...drawnList]
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard
  })
}
