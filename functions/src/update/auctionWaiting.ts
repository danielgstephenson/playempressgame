import { Transaction, arrayUnion } from 'firelord'
import updateOtherPlayers from './otherPlayers'
import { gamesRef, playersRef } from '../db'
import { Game, HistoryEvent, Player, Result } from '../types'

export default function updateAuctionWaiting ({
  currentGame,
  currentPlayer,
  privateEvent,
  publicEvent,
  transaction
}: {
  currentGame: Result<Game>
  currentPlayer: Result<Player>
  privateEvent: HistoryEvent
  publicEvent: HistoryEvent
  transaction: Transaction
}): void {
  const currentPlayerRef = playersRef.doc(currentPlayer.id)
  transaction.update(currentPlayerRef, {
    auctionReady: true,
    events: arrayUnion(privateEvent)
  })
  const profiles = currentGame.profiles.map(profile => {
    if (profile.userId === currentPlayer.userId) {
      return { ...profile, auctionReady: true }
    }
    return profile
  })
  const currentGameRef = gamesRef.doc(currentGame.id)
  transaction.update(currentGameRef, {
    profiles,
    events: arrayUnion(publicEvent)
  })
  const userIds = currentGame.profiles.map(profile => profile.userId)
  updateOtherPlayers({
    currentUid: currentPlayer.userId,
    gameId: currentGame.id,
    transaction,
    userIds,
    update: {
      events: arrayUnion(publicEvent)
    }
  })
}
