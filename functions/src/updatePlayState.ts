import { Transaction, arrayUnion, deleteField } from 'firelord'
import { PlayState, Player, Write } from './types'
import { gamesRef, playersRef } from './db'
import guardProfile from './guard/profile'

export default function updatePlayState ({
  playState,
  transaction
}: {
  playState: PlayState
  transaction: Transaction
}): void {
  playState.players.forEach(player => {
    const playerRef = playersRef.doc(player.id)
    const update: Write<Player> = {
      auctionReady: player.auctionReady,
      bid: player.bid,
      gold: player.gold,
      lastBidder: player.lastBidder,
      playScheme: player.playScheme ?? deleteField(),
      silver: player.silver,
      trashScheme: player.trashScheme ?? deleteField(),
      withdrawn: player.withdrawn,
      playReady: player.playReady
    }
    if (player.deck.length !== 0) {
      update.deck = arrayUnion(...player.deck)
    }
    if (player.discard.length !== 0) {
      update.discard = arrayUnion(...player.discard)
    }
    if (player.events.length !== 0) {
      update.events = arrayUnion(...player.events)
    }
    if (player.hand.length !== 0) {
      update.hand = arrayUnion(...player.hand)
    }
    if (player.tableau.length !== 0) {
      update.tableau = arrayUnion(...player.tableau)
    }
    if (player.trashHistory.length !== 0) {
      update.trashHistory = arrayUnion(...player.trashHistory)
    }
    const profile = guardProfile(playState, player.userId)
    profile.gold = player.gold
    profile.silver = player.silver
    profile.topDiscardScheme = player.discard[player.discard.length - 1]
    profile.deckEmpty = player.deck.length === 0
    profile.auctionReady = player.auctionReady
    profile.bid = player.bid
    if (player.deck.length !== 0) {
      profile.deckEmpty = false
    }
    if (player.discard.length !== 0) {
      profile.topDiscardScheme = player.discard[player.discard.length - 1]
    }
    profile.tableau = player.tableau
    profile.lastBidder = player.lastBidder
    profile.playReady = player.playReady
    profile.withdrawn = player.withdrawn
    transaction.update(playerRef, update)
  })
  const { id, ...rest } = playState.game
  const gameRef = gamesRef.doc(id)
  console.log('rest', rest)
  transaction.update(gameRef, rest)
}
