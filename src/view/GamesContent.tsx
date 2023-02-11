import { Spinner, Text } from '@chakra-ui/react'
import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, collection, Firestore } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'

interface Game {
  name: string
  id?: string
}

const gameConverter = {
  toFirestore: (game: WithFieldValue<Game>): DocumentData => {
    return { name: game.name }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    return { id: snapshot.id, name: data.name }
  }
}

export default function GamesContentView ({ db }: { db: Firestore }): JSX.Element {
  const gamesCollection = collection(db, 'games')
  const gamesConverted = gamesCollection.withConverter(gameConverter)
  const [games, gamesLoading, gamesError] = useCollectionData(gamesConverted)
  if (gamesLoading) {
    return <Spinner />
  }
  if (gamesError != null) {
    return <Text>{gamesError.message}</Text>
  }
  const items = games?.map((value) => <Text key={value.id}>{value.id}</Text>)
  return <>{items}</>
}
