import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import isYellow from '../is/yellow'
import earn from '../earn'
import getTopScheme from '../get/topScheme'
import addEvent from '../addEvent'

export default function effectTwenty ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent("First, earn twice your top discard scheme's rank.")
  const topScheme = getTopScheme(discard)
  const topRank = String(topScheme?.rank)
  const twiceGold = topScheme?.rank == null ? topScheme?.rank : topScheme.rank * 2
  const { gold: topGold, silver: topSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: twiceGold,
    event: firstEvent,
    message: `Your top discard scheme is ${topRank}.`,
    nonMessage: 'Your top discard is empty.'
  })
  const secondEvent = createEvent('Second, if it is not yellow, appoint it to the court.')
  const discardFull = topScheme != null
  if (!discardFull) {
    addEvent(secondEvent, 'Your discard is empty')
  }
  const topYellow = discardFull && isYellow(topScheme)
  const topColor = String(topScheme?.color)
  const topMessage = `Your top discard scheme, ${topRank}, is ${topColor},`
  if (topYellow) {
    addEvent(secondEvent, `${topMessage} so it is summoned to the court.`)
  } else {
    addEvent(secondEvent, `${topMessage} so it is not summoned to the court.`)
  }
  const topAppointments = topYellow ? [...appointments, topScheme] : appointments
  const topDiscard = discardFull ? discard.slice(0, -1) : discard
  return {
    effectAppointments: topAppointments,
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: topDiscard,
    effectGold: topGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: topSilver
  }
}
