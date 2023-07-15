import { CANT_CARRY_OUT_STYLES, CAN_CARRY_OUT_STYLES } from '../constants'
import { Scheme, SchemeStyles } from '../types'
import getBg from './getBg'

export default function getInCourtStyles ({
  deck,
  dungeon,
  phase,
  rank,
  tableau
}: {
  deck: Scheme[] | undefined
  dungeon: Scheme[] | undefined
  phase: string | undefined
  rank: number
  tableau: Scheme[] | undefined
}): SchemeStyles {
  const bg = getBg({ rank })
  const rankTwelve = rank === 12
  if (rankTwelve) {
    if (dungeon?.length === 0) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    if (tableau?.some(scheme => scheme.rank === 12) === true) {
      return { bg }
    }
    return { bg, ...CAN_CARRY_OUT_STYLES }
  }
  if (rank === 14) {
    if (deck != null && (deck.length < 2 || deck.every(scheme => scheme.rank === deck[0].rank))) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    if (tableau?.some(scheme => scheme.rank === 14) === true) {
      return { bg }
    }
    return { bg, ...CAN_CARRY_OUT_STYLES }
  }
  return { bg }
}
