import { CANT_CARRY_OUT_STYLES, CARRYING_OUT_STYLES, CAN_CARRY_OUT_STYLES } from '../constants'
import { Choice, Scheme, SchemeStyles } from '../types'

export default function get14Styles ({ bg, reserve, reserveLength, userId, gameId, phase, choices }: {
  bg: string
  reserve?: Scheme[]
  reserveLength?: number
  userId?: string
  gameId: string
  phase: string
  choices: Choice[]
}): SchemeStyles {
  if (userId == null) {
    return { bg }
  }
  if (reserve != null) {
    const playerId = `${userId}_${gameId}`
    if (reserve.length >= 1 || reserve.every(scheme => scheme.rank === reserve[0].rank)) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    } else if (phase === 'auction' && choices?.some(choice => choice.playerId === playerId)) {
      return { bg, ...CARRYING_OUT_STYLES }
    } else {
      return { bg, ...CAN_CARRY_OUT_STYLES }
    }
  }
  if (reserveLength != null) {
    if (reserveLength >= 1) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    return { bg, ...CAN_CARRY_OUT_STYLES }
  }
  return { bg }
}
