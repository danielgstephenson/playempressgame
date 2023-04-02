import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import { Identification } from './types'

export default function dataFromFirestore <Doc extends Identification> (snapshot: QueryDocumentSnapshot<Doc>, options?: SnapshotOptions): Doc {
  const data = snapshot.data(options)
  const doc = {
    id: snapshot.id,
    ...data
  }
  return doc
}
