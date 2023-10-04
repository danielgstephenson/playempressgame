import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'

export default function useBidMax (): number {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  if (playerState.gold == null || playerState.bid == null || playerState.silver == null || playerState.inPlay == null || gameState.profiles == null) {
    return 0
  }
  const ten = playerState.inPlay.some(scheme => scheme.rank === 10)
  const bidTen = playerState.bid >= 10
  const carryOutTen = ten && bidTen
  const eleven = playerState.inPlay.some(scheme => scheme.rank === 11)
  const bidFive = gameState.profiles.some(profile => profile.userId !== playerState.userId && profile.bid >= 5)
  const carryOutEleven = eleven && bidFive
  if (carryOutTen) {
    if (carryOutEleven) {
      return playerState.gold + playerState.silver + 10
    }
    return playerState.gold + 10
  }
  if (carryOutEleven) {
    return playerState.gold + playerState.silver
  }
  return playerState.gold
}
