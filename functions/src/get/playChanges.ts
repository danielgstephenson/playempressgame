import { deleteField } from 'firelord'
import isChanged from '../is/changed'
import { Write, Player, Profile, Scheme, PlayChanges } from '../types'

export default function getPlayChanges ({
  oldDeck,
  oldDiscard,
  oldGold,
  oldSilver,
  newDeck,
  newDiscard,
  newGold,
  newHand,
  newSilver
}: {
  oldDeck: Scheme[]
  oldDiscard: Scheme[]
  oldGold: number
  oldSilver: number
  newDeck: Scheme[]
  newDiscard: Scheme[]
  newGold: number
  newHand: Scheme[]
  newSilver: number
}): PlayChanges {
  const playerChanges: Write<Player> = {
    hand: newHand
  }
  const profileChanges: Write<Profile> = {}
  const deckedChanged = isChanged(oldDeck, newDeck)
  if (deckedChanged) {
    playerChanges.deck = newDeck
    const topChanged = oldDeck.length === 0
      ? newDeck.length > 0
      : newDeck.length === 0
    if (topChanged) {
      profileChanges.deckEmpty = newDeck.length === 0
    }
  }
  const discardChanged = isChanged(oldDiscard, newDiscard)
  if (discardChanged) {
    playerChanges.discard = newDiscard
  }
  const newTop = newDiscard[newDiscard.length - 1]
  const oldTop = oldDiscard[oldDiscard.length - 1]
  const topDiscardChanged = newTop?.id !== oldTop?.id
  if (topDiscardChanged) {
    profileChanges.topDiscardScheme = newTop ?? deleteField()
  }
  const goldChanged = newGold !== oldGold
  if (goldChanged) {
    playerChanges.gold = newGold
    profileChanges.gold = newGold
  }
  const silverChanged = newSilver !== oldSilver
  if (silverChanged) {
    playerChanges.silver = newSilver
    profileChanges.silver = newSilver
  }
  const profileChanged = Object.keys(profileChanges).length > 0
  return {
    playerChanges,
    profileChanges,
    profileChanged
  }
}
