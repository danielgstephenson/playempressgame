import { Stack } from '@chakra-ui/react'
import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, collection, query, where, Query } from 'firebase/firestore'
import { useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import dbContext from '../context/db'
import { Profile } from '../types'
import ProfileItemView from './ProfileItem'
import Viewer from './Viewer'

const profileConverter = {
  toFirestore: (profile: WithFieldValue<Profile>): DocumentData => {
    return { gameId: profile.gameId, userId: profile.userId }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    const profile: Profile = { id: snapshot.id, gameId: data.gameId, userId: data.userId }
    return profile
  }
}

export default function ProfilesContentView ({ gameId }: { gameId?: string }): JSX.Element {
  const dbState = useContext(dbContext)
  function getQuery (): Query<Profile> | null {
    if (dbState.db == null || gameId == null) return null
    const profilesCollection = collection(dbState.db, 'profiles')
    const profilesConverted = profilesCollection.withConverter(profileConverter)
    const q = query(profilesConverted, where('gameId', '==', gameId))
    return q
  }
  const q = getQuery()
  const profilesStream = useCollectionData(q)
  return (
    <Stack>
      <Viewer stream={profilesStream} View={ProfileItemView} />
    </Stack>
  )
}
