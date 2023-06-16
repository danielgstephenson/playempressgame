import joinRanks from '../../join/ranks'
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
  const courtJoined = joinRanks(playState.game.court)
  const buyer = playState.players.find(player => player.id === buyerId)
  if (buyer?.tableau.some(scheme => scheme.rank === 12) === true) {
    const dungeonJoined = joinRanks(playState.game.dungeon)
    const buyerMessage = `Choose which of ${courtJoined} from the court and ${dungeonJoined} from the dungeon to take.`
    const publicMessage = `${buyerName} is choosing which of ${courtJoined} from the court and ${dungeonJoined} from the dungeon to take.`
    return addTargetEvents({
      playState,
      message: publicMessage,
      targetMessages: {
        [buyerId]: buyerMessage
      }
    })
  }
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
