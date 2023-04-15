import drawMultiple from '../draw/multiple'
import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import reviveMultiple from '../revive/multiple'
import { SchemeEffectProps } from '../types'

export default function effectTwo ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const allTimes = allPlayers.map(player => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    const time = guardTime(playScheme.rank)
    return time
  })
  const minimumTime = Math.min(...allTimes)
  const {
    revivedDiscard,
    revivedList
  } = reviveMultiple({ discard: playerData.discard, reviveList: [], depth: minimumTime })
  const { drawnDeck, drawnList, drawnDiscard } = drawMultiple({
    deck: playerData.deck,
    discard: revivedDiscard,
    drawList: revivedList,
    depth: gameData.dungeon.length
  })
  const drawnHand = [...hand, ...drawnList]
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard
  })
}
