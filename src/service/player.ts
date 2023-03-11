import { Firestore, CollectionReference } from 'firebase/firestore'
import { Player } from '../types'
import convertCollection from './convertCollection'

export default function getPlayersRef (db: Firestore): CollectionReference<Player> {
  const gamesRef = convertCollection<Player>({
    db,
    collectionName: 'players',
    toFirestore: (player) => {
      return {
        deck: player.deck,
        discard: player.discard,
        gameId: player.gameId,
        hand: player.hand,
        userId: player.userId
      }
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options)
      const player = {
        id: snapshot.id,
        deck: data.deck,
        discard: data.discard,
        gameId: data.gameId,
        hand: data.hand,
        userId: data.userId
      }
      return player
    }
  })
  return gamesRef
}
