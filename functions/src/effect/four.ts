import drawMultiple from '../draw/multiple'
import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import { SchemeEffectProps } from '../types'
import { createSchemeRef } from '../create/schemeRef'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'

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
  const firstEvent = createEvent('First, you take 1 Privilege into your hand.')
  const privelege = createSchemeRef(1)
  const bankHand = [...hand, privelege]
  const secondEvent = createEvent('Second, you draw the lowest time in play.')
  const allTimes = allPlayers.map(player => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    const time = guardTime(playScheme.rank)
    return time
  })
  const minimumTime = Math.min(...allTimes)
  const {
    drawnDeck,
    drawnDiscard,
    drawnHand
  } = drawMultiple({
    deck: playerData.deck,
    discard: playerData.deck,
    hand: bankHand,
    depth: minimumTime
  })
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
