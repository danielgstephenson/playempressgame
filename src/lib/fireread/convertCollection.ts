import { collection, CollectionReference } from 'firebase/firestore'
import { ConvertCollectionProps } from './types'

export default function convertCollection <Doc> ({
  db,
  collectionName,
  converter
}: ConvertCollectionProps<Doc>): CollectionReference<Doc> {
  const gamesRef = collection(db, collectionName)
  const gamesConverted = gamesRef.withConverter(converter)
  return gamesConverted
}
