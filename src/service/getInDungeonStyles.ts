import { Scheme, SchemeStyles } from '../types'
import getBg from './getBg'

export default function getInDungeonStyles ({
  court,
  phase,
  rank,
  tableau
}: {
  court?: Scheme[]
  phase?: string
  rank: number
  tableau?: Scheme[]
}): SchemeStyles {
  const bg = getBg({ rank })
  if (phase !== 'auction') {
    return { bg }
  }
  if (rank === 14) {
    if (tableau?.some(scheme => scheme.rank === 14) === true) {
      return { bg }
    }
    if (tableau?.some(scheme => scheme.rank === 12) === true || court?.some(scheme => scheme.rank === 12) === true) {
      return { bg: 'white', color: bg }
    }
  }
  return { bg }
}
