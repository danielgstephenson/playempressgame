import { collection, CollectionReference, Firestore, FirestoreDataConverter } from 'firebase/firestore'

export default function convertCollection <Doc> ({
  db,
  collectionName,
  converter
}: {
  db: Firestore
  collectionName: string
  converter: FirestoreDataConverter<Doc>
}): CollectionReference<Doc> {
  const gamesRef = collection(db, collectionName)
  const gamesConverted = gamesRef.withConverter(converter)
  return gamesConverted
}
