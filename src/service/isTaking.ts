import { DocState } from '../lib/fireread/types'
import { Game } from '../types'
import areAllReady from './areAllReady'
import isHighestUntiedBidder from './isHighestUntiedBidder'

export default function isTaking ({
  game,
  userId
}: {
  game: DocState<Game>
  userId: string
}): boolean {
  const allReady = areAllReady(game.profiles)
  const highestUntiedBidder = isHighestUntiedBidder({ game, userId })
  return allReady && highestUntiedBidder
}
