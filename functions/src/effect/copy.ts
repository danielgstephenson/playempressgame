import createEvent from '../create/event'
import guardEffect from '../guard/effect'
import { SchemeEffectProps, SchemeData, EffectResult, HistoryEvent, SchemeRef } from '../types'

export default function copyEffect ({
  summons,
  condition = true,
  choices,
  deck,
  discard,
  dungeon,
  copiedByFirstEffect: first,
  gold,
  silver,
  passedTimeline,
  hand,
  message,
  nonEvent,
  nonMessage,
  playerId,
  playSchemeRef,
  playSchemes,
  resume,
  scheme,
  event
}: SchemeEffectProps & {
  condition?: boolean
  scheme: SchemeData | SchemeRef | undefined
  message: string
  event: HistoryEvent
} & ({
  nonEvent: HistoryEvent
  nonMessage?: undefined
} | {
  nonMessage: string
  nonEvent?: undefined
})): EffectResult {
  const pass = {
    effectChoices: choices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: gold,
    effectSilver: silver,
    effectHand: hand,
    effectPlayerEvents: [],
    effectSummons: []
  }
  if (first === true && resume === true) {
    return pass
  }
  if (scheme == null || !condition) {
    const non = nonEvent ?? createEvent(nonMessage)
    event.children.push(non)
    return pass
  }
  const effect = guardEffect(scheme.rank)
  event.children.push(createEvent(message))
  const {
    effectSummons: copySummons,
    effectChoices: copyChoices,
    effectDeck: copyDeck,
    effectDiscard: copyDiscard,
    effectGold: copyGold,
    effectSilver: copySilver,
    effectHand: copyHand,
    effectPlayerEvents: copyEvents
  } = effect({
    summons,
    choices,
    deck,
    discard,
    dungeon,
    copiedByFirstEffect: first,
    gold,
    silver,
    passedTimeline,
    hand,
    playerId,
    playSchemeRef,
    playSchemes
  })
  event.children.push(...copyEvents)
  return {
    effectSummons: copySummons,
    effectChoices: copyChoices,
    effectDeck: copyDeck,
    effectDiscard: copyDiscard,
    effectGold: copyGold,
    effectSilver: copySilver,
    effectHand: copyHand,
    effectPlayerEvents: copyEvents
  }
}
