import drawMultiple from '../draw/multiple'
import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import { SchemeColor, SchemeEffectProps } from '../types'
import reviveMultiple from '../revive/multiple'

export default function effectFive ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  function getTopDiscardSchemeTime (): number {
    if (playerData.discard.length === 0) return 0
    const topDiscardSlice = playerData.discard.slice(-1)
    const topDiscardScheme = topDiscardSlice[0]
    if (topDiscardScheme == null) return 0
    const topDiscardSchemeTime = guardTime(topDiscardScheme.rank)
    return topDiscardSchemeTime
  }
  const reviveNumber = getTopDiscardSchemeTime()
  const { revivedDiscard, revivedList } = reviveMultiple({
    discard: playerData.discard,
    reviveList: playerData.discard,
    depth: reviveNumber
  })
  const uniqueColors = allPlayers.reduce<SchemeColor[]>((uniqueColors, player) => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    if (uniqueColors.includes(playScheme.color)) return uniqueColors
    return [...uniqueColors, playScheme.color]
  }, [])
  const { drawnDeck, drawnDiscard, drawnList } = drawMultiple({
    deck: playerData.deck,
    discard: revivedDiscard,
    drawList: revivedList,
    depth: uniqueColors.length * 2
  })
  const drawnHand = [...hand, ...drawnList]
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard
  })
}
