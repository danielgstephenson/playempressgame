import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { Profile } from '../types'

export const profileConverter = {
  toFirestore: (profile: WithFieldValue<Profile>): DocumentData => {
    return { gameId: profile.gameId, userId: profile.userId }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    const profile: Profile = { id: snapshot.id, gameId: data.gameId, userId: data.userId }
    return profile
  }
}
