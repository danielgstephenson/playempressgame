import { CAN_CARRY_OUT_STYLES } from '../constants'
import { SchemeStyles } from '../types'
import getBg from './getBg'

export default function getInDiscardStyles ({
  discardId,
  discardRank,
  playId
}: {
  discardId?: string
  discardRank: number
  playId?: string
}): SchemeStyles {
  const bg = getBg({ rank: discardRank })
  if (discardRank === 8 && discardId === playId) {
    return { bg, ...CAN_CARRY_OUT_STYLES }
  }
  return { bg }
}
