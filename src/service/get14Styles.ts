import { CANT_CARRY_OUT_STYLES, CARRYING_OUT_STYLES, CAN_CARRY_OUT_STYLES } from '../constants'
import { Choice, Scheme, SchemeStyles } from '../types'

export default function get14Styles ({ bg, deck, deckEmpty, userId, gameId, phase, choices }: {
  bg: string
  deck?: Scheme[]
  deckEmpty?: boolean
  userId?: string
  gameId: string
  phase: string
  choices: Choice[]
}): SchemeStyles {
  if (userId == null) {
    return { bg }
  }
  if (deck != null) {
    const playerId = `${userId}_${gameId}`
    if (deck.length >= 2 || deck.every(scheme => scheme.rank === deck[0].rank)) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    } else if (phase === 'auction' && choices?.some(choice => choice.playerId === playerId)) {
      return { bg, ...CARRYING_OUT_STYLES }
    } else {
      return { bg, ...CAN_CARRY_OUT_STYLES }
    }
  }
  if (deckEmpty != null) {
    if (deckEmpty) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    return { bg, ...CAN_CARRY_OUT_STYLES }
  }
  return { bg }
}
