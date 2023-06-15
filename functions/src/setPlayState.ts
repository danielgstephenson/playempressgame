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
    profile.topDiscardScheme = player.discard[0]
    profile.deckEmpty = player.deck.length === 0
    profile.auctionReady = player.auctionReady
    profile.bid = player.bid
    profile.lastBidder = player.lastBidder
    profile.playReady = player.playReady
    profile.tableau = player.tableau
    profile.trashHistory = player.trashHistory.map(event => ({ round: event.round }))
    profile.withdrawn = player.withdrawn
  })
  const { id, ...rest } = playState.game
  const gameRef = gamesRef.doc(id)
  transaction.update(gameRef, rest)
}
