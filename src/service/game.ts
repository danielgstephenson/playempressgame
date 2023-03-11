import { WithFieldValue, DocumentData, Firestore, CollectionReference } from 'firebase/firestore'
import { Game } from '../types'
import convertCollection from './convertCollection'

export default function getGamesRef (db: Firestore): CollectionReference<Game> {
  const gamesRef = convertCollection<Game>({
    db,
    collectionName: 'games',
    toFirestore: (game: WithFieldValue<Game>): DocumentData => {
      return { name: game.name }
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options)
      const game = {
        id: snapshot.id,
        name: data.name,
        phase: data.phase,
        timeline: data.timeline,
        court: data.court,
        dungeon: data.dungeon
      }
      return game
    }
  })
  return gamesRef
}
