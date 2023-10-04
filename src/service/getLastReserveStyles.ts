import { CARRYING_OUT_STYLES } from '../constants'
import { SchemeStyles } from '../types'
import getBg from './getBg'

export default function getLastReserveStyles ({
  lastReserveId,
  lastReserveRank,
  playId
}: {
  lastReserveId?: string
  lastReserveRank: number
  playId?: string
}): SchemeStyles {
  const bg = getBg({ rank: lastReserveRank })
  if (lastReserveRank === 8 && lastReserveId === playId) {
    return { bg, ...CARRYING_OUT_STYLES }
  }
  return { bg }
}
