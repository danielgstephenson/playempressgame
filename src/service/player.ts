import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { Player } from '../types'

export const playerConverter = {
  toFirestore: (player: WithFieldValue<Player>): DocumentData => {
    return {
      deck: player.deck,
      discard: player.discard,
      gameId: player.gameId,
      hand: player.hand,
      userId: player.userId
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Player => {
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
}
