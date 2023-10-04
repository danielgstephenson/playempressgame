import { Choice, Scheme, SchemeStyles } from '../types'
import get14Styles from './get14Styles'
import getBg from './getBg'

export default function getInDungeonStyles ({
  choices,
  court,
  gameId,
  inPlay,
  phase,
  rank,
  reserve,
  reserveLength,
  userId
}: {
  choices: Choice[]
  court?: Scheme[]
  reserve?: Scheme[]
  reserveLength?: number
  gameId: string
  phase?: string
  rank: number
  inPlay?: Scheme[]
  userId?: string
}): SchemeStyles {
  const bg = getBg({ rank })
  if (phase !== 'auction') {
    return { bg }
  }
  if (rank === 14) {
    if (inPlay?.some(scheme => scheme.rank === 14) === true) {
      return { bg }
    }
    if (inPlay?.some(scheme => scheme.rank === 12) === true || court?.some(scheme => scheme.rank === 12) === true) {
      return get14Styles({
        bg,
        reserve,
        reserveLength,
        userId,
        gameId,
        phase,
        choices
      })
    }
  }
  return { bg }
}
