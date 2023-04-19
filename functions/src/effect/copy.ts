import createEvent from '../create/event'
import guardEffect from '../guard/effect'
import { SchemeEffectProps, SchemeData, EffectResult, HistoryEvent, SchemeRef } from '../types'

export default function copyEffect ({
  appointments,
  condition = true,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  message,
  nonMessage,
  playerId,
  playSchemes,
  scheme,
  event
}: SchemeEffectProps & {
  condition?: boolean
  scheme: SchemeData | SchemeRef | undefined
  message: string
  nonMessage: string
  event: HistoryEvent
}): EffectResult {
  if (scheme == null || !condition) {
    event.children.push(createEvent(nonMessage))
    return {
      effectAppointments: appointments,
      effectChoices: choices,
      effectDeck: deck,
      effectDiscard: discard,
      effectGold: gold,
      effectHand: hand,
      effectPlayerEvents: []
    }
  }
  const effect = guardEffect(scheme.rank)
  event.children.push(createEvent(message))
  const {
    effectAppointments: copyAppointments,
    effectChoices: copyChoices,
    effectDeck: copyDeck,
    effectDiscard: copyDiscard,
    effectGold: copyGold,
    effectHand: copyHand,
    effectPlayerEvents: copyEvents
  } = effect({
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
  })
  event.children.push(...copyEvents)
  return {
    effectAppointments: copyAppointments,
    effectChoices: copyChoices,
    effectDeck: copyDeck,
    effectDiscard: copyDiscard,
    effectGold: copyGold,
    effectHand: copyHand,
    effectPlayerEvents: copyEvents
  }
}
