import guardHandScheme from '../guard/handScheme'
import guardTime from '../guard/time'
import { HistoryEvent, SchemeEffectProps } from '../types'
import { createEvent } from '../create/event'
import { arrayUnion } from 'firelord'
import revive from '../revive'
import guardDefined from '../guard/defined'
import draw from '../draw'

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
  function getTopDiscardSchemeTime (): { time: number, timeEvent: HistoryEvent } {
    if (playerData.discard.length === 0) {
      return {
        time: 0,
        timeEvent: createEvent('Your discard is empty, so you do not revive.')
      }
    }
    const topDiscardSlice = playerData.discard.slice(-1)
    const topDiscardScheme = guardDefined(topDiscardSlice[0], 'Top discard scheme')
    const topDiscardSchemeTime = guardTime(topDiscardScheme.rank)
    return {
      time: topDiscardSchemeTime,
      timeEvent: createEvent(`Your top discard scheme is ${topDiscardScheme.rank} with ${topDiscardSchemeTime} time.`)
    }
  }
  const { time, timeEvent } = getTopDiscardSchemeTime()
  const { revivedDiscard, revivedHand, reviveEvents } = revive({
    discard: playerData.discard,
    hand,
    depth: time
  })
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent("First, you revive your top discard scheme's time", firstChildren)
  const uniqueColors = allPlayers.reduce<string[]>((uniqueColors, player) => {
    const playScheme = guardHandScheme({ hand: player.hand, schemeId: player.playId, label: 'Play scheme' })
    if (uniqueColors.includes(playScheme.color)) return uniqueColors
    return [...uniqueColors, playScheme.color]
  }, [])
  const doubleColors = uniqueColors.length * 2
  const colorMessage = uniqueColors.length === 1 ? `is ${uniqueColors.length} color` : `are ${uniqueColors.length} colors`
  const colorsEvent = createEvent(`There ${colorMessage} in play, so you draw ${doubleColors}`)
  const { drawnDeck, drawnDiscard, drawnHand, drawEvents } = draw({
    deck: playerData.deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: uniqueColors.length * 2
  })
  const secondChildren = [colorsEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw twice the number of colors in play.', secondChildren)
  transaction.update(playerRef, {
    hand: drawnHand,
    deck: drawnDeck,
    discard: drawnDiscard,
    history: arrayUnion(firstEvent, secondEvent)
  })
}
