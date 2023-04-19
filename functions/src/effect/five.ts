import { HistoryEvent, SchemeEffectProps, SchemeResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import draw from '../draw'
import getGrammar from '../get/grammar'
import guardSchemeData from '../guard/schemeData'
import getTop from '../get/top'

export default function effectFive ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes
}: SchemeEffectProps): SchemeResult {
  function getTopDiscardSchemeTime (): { time: number, timeEvent: HistoryEvent } {
    const top = getTop(discard)
    if (top == null) {
      return {
        time: 0,
        timeEvent: createEvent('Your discard is empty, so you do not revive.')
      }
    }
    const topData = guardSchemeData(top.rank)
    return {
      time: topData.time,
      timeEvent: createEvent(`Your top discard scheme is ${topData.rank} with ${topData.time} time.`)
    }
  }
  const { time, timeEvent } = getTopDiscardSchemeTime()
  const { revivedDiscard, revivedHand, reviveEvents } = revive({
    discard,
    hand,
    depth: time
  })
  const firstChildren = [timeEvent, ...reviveEvents]
  const firstEvent = createEvent("First, you revive your top discard scheme's time", firstChildren)
  const uniqueColors = playSchemes.reduce<string[]>((uniqueColors, scheme) => {
    const playScheme = guardSchemeData(scheme.rank)
    if (uniqueColors.includes(playScheme.color)) return uniqueColors
    return [...uniqueColors, playScheme.color]
  }, [])
  const doubleColors = uniqueColors.length * 2
  const { phrase } = getGrammar(uniqueColors.length, 'color', 'colors')
  const colorsEvent = createEvent(`There ${phrase} in play, so you draw ${doubleColors}`)
  const { drawnDeck, drawnDiscard, drawnHand, drawEvents } = draw({
    deck,
    discard: revivedDiscard,
    hand: revivedHand,
    depth: uniqueColors.length * 2
  })
  const secondChildren = [colorsEvent, ...drawEvents]
  const secondEvent = createEvent('Second, you draw twice the number of colors in play.', secondChildren)
  return {
    appointments,
    choices,
    deck: drawnDeck,
    discard: drawnDiscard,
    gold,
    hand: drawnHand,
    playerEvents: [firstEvent, secondEvent]
  }
}
