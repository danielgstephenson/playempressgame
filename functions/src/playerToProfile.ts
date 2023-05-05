import { Player, Profile, Result } from './types'

export default function playerToProfile (player: Result<Player>): Result<Profile> {
  return {
    id: player.id,
    userId: player.userId,
    gameId: player.gameId,
    deckEmpty: player.deck.length === 0,
    displayName: player.displayName,
    topDiscardScheme: player.discard[player.discard.length - 1],
    gold: player.gold,
    silver: player.silver,
    trashEmpty: player.trashScheme == null,
    playEmpty: player.playScheme == null,
    ready: false
  }
}
