import { createEvent } from './create/event'
import guardEffect from './guard/effect'
import { SchemeEffectProps, SchemeData, SchemeResult, HistoryEvent, SchemeRef } from './types'

export default function copyScheme ({
  appointments,
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
  scheme: SchemeData | SchemeRef | undefined
  message: string
  nonMessage: string
  event: HistoryEvent
}): SchemeResult {
  if (scheme == null) {
    event.children.push(createEvent(nonMessage))
    return {
      appointments,
      choices,
      deck,
      discard,
      gold,
      hand,
      playerEvents: []
    }
  }
  const effect = guardEffect(scheme.rank)
  const copyMessage = `${message} ${scheme.rank}.`
  event.children.push(createEvent(copyMessage))
  const {
    appointments: copyAppointments,
    choices: copyChoices,
    deck: copyDeck,
    discard: copyDiscard,
    gold: copyGold,
    hand: copyHand,
    playerEvents: copyEvents
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
    appointments: copyAppointments,
    choices: copyChoices,
    deck: copyDeck,
    discard: copyDiscard,
    gold: copyGold,
    hand: copyHand,
    playerEvents: copyEvents
  }
}
