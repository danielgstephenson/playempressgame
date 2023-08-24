import { Choice, Scheme, SchemeStyles } from '../types'
import get14Styles from './get14Styles'
import getBg from './getBg'

export default function getInDungeonStyles ({
  choices,
  court,
  deck,
  deckEmpty,
  gameId,
  phase,
  rank,
  tableau,
  userId
}: {
  choices: Choice[]
  court?: Scheme[]
  deck?: Scheme[]
  deckEmpty: boolean
  gameId: string
  phase?: string
  rank: number
  tableau?: Scheme[]
  userId: string
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
      return get14Styles({
        bg,
        deck,
        deckEmpty,
        userId,
        gameId,
        phase,
        choices
      })
    }
  }
  return { bg }
}
