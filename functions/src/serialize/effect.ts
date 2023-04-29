import { EffectResult, SerializedEffect } from '../types'
import serializeSchemes from './schemes'

export default function serializeEffect (effect: EffectResult): SerializedEffect {
  const {
    effectSummons,
    effectChoices,
    effectDeck,
    effectDiscard,
    effectGold,
    effectHand,
    effectPlayerEvents,
    effectSilver
  } = effect

  return {
    effectSummons: serializeSchemes(effectSummons),
    effectChoices,
    effectDeck: serializeSchemes(effectDeck),
    effectDiscard: serializeSchemes(effectDiscard),
    effectGold,
    effectHand: serializeSchemes(effectHand),
    effectPlayerEvents,
    effectSilver
  }
}
