import { CollectionReference, Firestore, FirestoreDataConverter } from 'firebase/firestore'
import convertCollection from './convertCollection'
import { Safe } from './types'

export default function getSafe <Doc, Requirements extends {}, Output> ({
  db,
  collectionName,
  converter,
  requirements,
  getter
}: {
  db?: Firestore
  collectionName: string
  converter: FirestoreDataConverter<Doc>
  requirements: Requirements
  getter: ({ collectionRef, requirements }: {
    collectionRef: CollectionReference<Doc>
    requirements: Safe<Requirements>
  }) => Output
}): Output | undefined {
  if (db == null) return undefined
  const collectionRef = convertCollection<Doc>({ db, collectionName, converter })
  function hasAllValues (requirements: Requirements): requirements is Safe<Requirements> {
    const values = Object.values(requirements)
    const hasAllValues = values.every((value) => value != null)
    return hasAllValues
  }
  if (!hasAllValues(requirements)) {
    return undefined
  }
  const query = getter({ collectionRef, requirements })
  return query
}
