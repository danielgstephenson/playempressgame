import { Spinner, Text } from '@chakra-ui/react'
import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, collection, Firestore } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'

interface User {
  uid: string
  id?: string
}
const userConverter = {
  toFirestore: (user: WithFieldValue<User>): DocumentData => {
    return { uid: user.uid }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)
    return { id: snapshot.id, uid: data.uid }
  }
}

export default function UsersContentView ({ db }: { db: Firestore }): JSX.Element {
  const usersCollection = collection(db, 'users')
  const usersConverted = usersCollection.withConverter(userConverter)
  const [users, usersLoading, usersError] = useCollectionData(usersConverted)
  if (usersLoading) {
    return <Spinner />
  }
  if (usersError != null) {
    return <Text>{usersError.message}</Text>
  }
  const items = users?.map((value) => <Text key={value.id}>{value.uid}</Text>)
  return <>{items}</>
}
