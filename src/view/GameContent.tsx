import { Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, collection, Firestore, query, where } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import ChakraLinkView from './ChakraLink'

interface Game {
  name: string
  id?: string
}

interface Profile {
  gameId: string
  userId: string
  id?: string
}

const gameConverter = {
  toFirestore: (game: WithFieldValue<Game>): DocumentData => {
    return { name: game.name }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    const game: Game = { id: snapshot.id, name: data.name }
    return game
  }
}

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

export default function GameContentView ({ db, gameId }: { db: Firestore, gameId: string }): JSX.Element {
  const profilesCollection = collection(db, 'profiles')
  const profilesConverted = profilesCollection.withConverter(profileConverter)
  const q = query(profilesConverted, where('gameId', '==', gameId))
  const [profiles, profilesLoading, profilesError] = useCollectionData(q)
  if (profilesLoading) {
    return <Spinner />
  }
  if (profilesError != null) {
    return <Text>{profilesError.message}</Text>
  }
  const items = profiles?.map((value) => {
    return <Text key={value.id}>{value.userId}</Text>
  })
  return (
    <>
      <Stack>{items}</Stack>
    </>
  )
}
