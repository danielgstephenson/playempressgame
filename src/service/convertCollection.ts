import { collection, CollectionReference, DocumentData, Firestore, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from 'firebase/firestore'

export default function convertCollection <Doc> ({
  db,
  collectionName,
  toFirestore,
  fromFirestore
}: {
  db: Firestore
  collectionName: string
  toFirestore: (modelObject: WithFieldValue<Doc>) => DocumentData
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions) => Doc
}): CollectionReference<Doc> {
  const converter = {
    toFirestore,
    fromFirestore
  }
  const gamesRef = collection(db, collectionName)
  const gamesConverted = gamesRef.withConverter(converter)
  return gamesConverted
}
