import { Transaction, arrayUnion } from 'firelord'
import { gamesRef, playersRef } from '../db'
import { Write, Player, HistoryEvent, Result, Game, Profile } from '../types'
import { END_AUCTION } from '../constants'

export default function updateEndAuction ({
  currentGame,
  currentPlayer,
  currentPlayerChanges,
  currentProfileChanges,
  gameChanges,
  privateReadyEvent,
  publicReadyEvent,
  privateEndEvent,
  publicEndEvent,
  transaction
}: {
  currentGame: Result<Game>
  currentPlayer: Result<Player>
  currentPlayerChanges?: Write<Player>
  currentProfileChanges?: Partial<Profile>
  gameChanges?: Write<Game>
  privateReadyEvent: HistoryEvent
  privateEndEvent?: HistoryEvent
  publicReadyEvent: HistoryEvent
  publicEndEvent: HistoryEvent
  transaction: Transaction
}): void {
  const endEvent = privateEndEvent ?? publicEndEvent
  const currentPlayerUpdate: Write<Player> = {
    ...END_AUCTION,
    events: arrayUnion(privateReadyEvent, endEvent),
    ...currentPlayerChanges
  }
  const currentPlayerRef = playersRef.doc(currentPlayer.id)
  transaction.update(currentPlayerRef, currentPlayerUpdate)
  const profiles = currentGame.profiles.map(profile => {
    const { playScheme, ...rest } = profile
    const currentChanges = profile.userId === currentPlayer.userId
      ? currentProfileChanges
      : {}
    return {
      ...rest,
      ...END_AUCTION,
      ...currentChanges
    }
  })
  const currentGameRef = gamesRef.doc(currentGame.id)
  transaction.update(currentGameRef, {
    events: arrayUnion(publicReadyEvent, publicEndEvent),
    profiles,
    ...gameChanges
  })
  const publicUpdate: Write<Player> = {
    events: arrayUnion(publicReadyEvent, publicEndEvent),
    ...END_AUCTION
  }
  currentGame.profiles.forEach(profile => {
    if (profile.userId === currentPlayer.userId) {
      return
    }
    const playerId = `${profile.userId}_${currentGame.id}`
    const playerRef = playersRef.doc(playerId)
    transaction.update(playerRef, publicUpdate)
  })
}
