import drawMultiple from '../draw/multiple'
import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import { SchemeEffectProps } from '../types'
import { createScheme } from '../create/scheme'

export default function effectFour ({
  allPlayers,
  playerData,
  gameData,
  gameRef,
  hand,
  passedTimeline,
  playerRef,
  transaction
}: SchemeEffectProps): void {
  const privelege = createScheme(1)
  const bankList = [privelege]
  const allTimes = allPlayers.map(player => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    const time = guardTime(playScheme.rank)
    return time
  })
  const minimumTime = Math.min(...allTimes)
  const {
    drawnDeck,
    drawnDiscard,
    drawnList
  } = drawMultiple({
    deck: playerData.deck,
    discard: playerData.deck,
    drawList: bankList,
    depth: minimumTime
  })
  const drawnHand = [...hand, ...drawnList]
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard
  })
}
