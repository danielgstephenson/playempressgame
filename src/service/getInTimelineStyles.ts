import { Choice, Profile, Scheme, SchemeStyles } from '../types'
import getBg from './getBg'
import getInCourtStyles from './getInCourtStyles'
import isTaking from './isTaking'

export default function getInTimelineStyles ({
  choices,
  deck,
  dungeon,
  phase,
  profiles,
  userId,
  rank,
  tableau
}: {
  choices: Choice[]
  deck: Scheme[] | undefined
  dungeon: Scheme[] | undefined
  phase: string | undefined
  profiles: Profile[]
  rank: number
  tableau: Scheme[] | undefined
  userId?: string
}): SchemeStyles {
  const taking = isTaking({ profiles, userId, choices })
  if (taking) {
    const bg = getBg({ rank })
    return { bg }
  }
  return getInCourtStyles({ deck, dungeon, phase, rank, tableau })
}
