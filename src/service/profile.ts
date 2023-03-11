import { Firestore, CollectionReference } from 'firebase/firestore'
import { Profile } from '../types'
import convertCollection from './convertCollection'

export default function getProfilesRef (db: Firestore): CollectionReference<Profile> {
  const gamesRef = convertCollection<Profile>({
    db,
    collectionName: 'profiles',
    toFirestore: (profile) => {
      return { gameId: profile.gameId, userId: profile.userId }
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options)
      const profile = { id: snapshot.id, gameId: data.gameId, userId: data.userId }
      return profile
    }
  })
  return gamesRef
}
