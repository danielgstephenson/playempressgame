import { Choice, Profile, Scheme, SchemeStyles } from '../types'
import getBg from './getBg'
import getInCourtStyles from './getInCourtStyles'
import isTaking from './isTaking'

export default function getInTimelineStyles ({
  choices,
  reserve,
  dungeon,
  inPlay,
  phase,
  profiles,
  userId,
  rank
}: {
  choices: Choice[]
  reserve: Scheme[] | undefined
  dungeon: Scheme[] | undefined
  phase: string | undefined
  profiles: Profile[]
  rank: number
  inPlay: Scheme[] | undefined
  userId?: string
}): SchemeStyles {
  const taking = isTaking({ profiles, userId, choices })
  if (taking) {
    const bg = getBg({ rank })
    return { bg }
  }
  return getInCourtStyles({ reserve: reserve, dungeon, phase, rank, inPlay: inPlay })
}
