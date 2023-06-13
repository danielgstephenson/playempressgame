import getJoinedRanks from '../../get/joined/ranks'
import { PlayState, TargetEvents } from '../../types'
import addTargetEvents from './target'

export default function addCourtEvents ({
  buyerId,
  buyerName,
  playState
}: {
  buyerId: string
  buyerName: string
  playState: PlayState
}): TargetEvents {
  const courtJoined = getJoinedRanks(playState.game.court)
  const buyerCourtMessage = `Choose which of ${courtJoined} to take from the court.`
  const loserCourtMessage = `${buyerName} is choosing which of ${courtJoined} to take from the court.`
  return addTargetEvents({
    playState,
    message: loserCourtMessage,
    targetMessages: {
      [buyerId]: buyerCourtMessage
    }
  })
}
