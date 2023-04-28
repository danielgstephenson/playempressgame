import { deleteField } from 'firelord'
import isChanged from '../is/changed'
import { EffectResult, PlayChanges, Player, Profile, SchemeRef, Write } from '../types'
import serializeEffect from '../serialize/effect'

export default function getPlayChanges ({
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
}): PlayChanges {
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
  const playerChanges: Write<Player> = {
    hand: effectHand
  }
  const profileChanges: Write<Profile> = {}
  const deckedChanged = isChanged(deck, effectDeck)
  if (deckedChanged) {
    playerChanges.deck = effectDeck
    const topChanged = deck.length === 0
      ? effectDeck.length > 0
      : effectDeck.length === 0
    if (topChanged) {
      profileChanges.deckEmpty = effectDeck.length === 0
    }
  }
  const discardChanged = isChanged(discard, effectDiscard)
  if (discardChanged) {
    playerChanges.discard = effectDiscard
  }
  const effectTop = effectDiscard[effectDiscard.length - 1]
  const resultTop = discard[discard.length - 1]
  const topdiscardChanged = effectTop?.id !== resultTop?.id
  if (topdiscardChanged) {
    profileChanges.topDiscardScheme = effectTop ?? deleteField()
  }
  const goldChanged = effectGold !== gold
  if (goldChanged) {
    playerChanges.gold = effectGold
    profileChanges.gold = effectGold
  }
  const silverChanged = effectSilver !== silver
  if (silverChanged) {
    playerChanges.silver = effectSilver
    profileChanges.silver = effectSilver
  }
  const profileChanged = Object.keys(profileChanges).length > 0
  return {
    effectSummons,
    effectChoices,
    effectDeck,
    effectDiscard,
    effectGold,
    effectSilver,
    effectHand,
    effectPlayerEvents,
    playerChanges,
    profileChanges,
    profileChanged
  }
}
