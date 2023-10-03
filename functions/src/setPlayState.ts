import { Transaction, deleteField } from 'firelord'
import { PlayState, Player } from './types'
import { gamesRef, playersRef } from './db'
import guardProfile from './guard/profile'

export default function setPlayState ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  playState.players.forEach(player => {
    const { id, ...rest } = player
    const playerRef = playersRef.doc(id)
    const newPlayer: Player['writeFlatten'] = {
      ...rest,
      playScheme: rest.playScheme ?? deleteField(),
      trashScheme: rest.trashScheme ?? deleteField()
    }
    transaction.update(playerRef, newPlayer)
    const profile = guardProfile(playState, player.userId)
    profile.gold = player.gold
    profile.silver = player.silver
    profile.auctionReady = player.auctionReady
    profile.bid = player.bid
    profile.lastBidder = player.lastBidder
    profile.lastReserve = player.reserve[player.reserve.length - 1]
    profile.playReady = player.playReady
    profile.playScheme = rest.playScheme
    profile.reserveLength = player.reserve.length
    profile.inPlay = player.inPlay
    profile.trashHistory = player.trashHistory.map(event => ({ round: event.round }))
    profile.withdrawn = player.withdrawn
  })
  const { id, ...rest } = playState.game
  const gameRef = gamesRef.doc(id)
  transaction.update(gameRef, rest)
}
