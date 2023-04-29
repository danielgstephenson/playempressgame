import { EffectResult, EffectResultChanges, SchemeRef } from '../types'
import serializeEffect from '../serialize/effect'
import getPlayChanges from './playChanges'

export default function getEffectResultChanges ({
  deck,
  discard,
  effectResult,
  gold,
  hand,
  silver
}: {
  deck: SchemeRef[]
  discard: SchemeRef[]
  effectResult: EffectResult
  gold: number
  hand: SchemeRef[]
  silver: number
}): EffectResultChanges {
  const {
    effectSummons,
    effectChoices,
    effectDeck,
    effectDiscard,
    effectGold,
    effectSilver,
    effectHand,
    effectPlayerEvents
  } = serializeEffect(effectResult)
  const playChanges = getPlayChanges({
    oldDeck: deck,
    oldDiscard: discard,
    oldGold: gold,
    oldSilver: silver,
    newDeck: effectDeck,
    newDiscard: effectDiscard,
    newGold: effectGold,
    newHand: effectHand,
    newSilver: effectSilver
  })
  return {
    effectSummons,
    effectChoices,
    effectDeck,
    effectDiscard,
    effectGold,
    effectSilver,
    effectHand,
    effectPlayerEvents,
    ...playChanges
  }
}
