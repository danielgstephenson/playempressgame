import { CollectionReference, Firestore, FirestoreDataConverter } from 'firebase/firestore'
import convertCollection from './convertCollection'
import { Safe } from './types'

// interface X {
//   a: number | undefined
//   b?: {
//     c?: number
//   }
// }
// type Y = Safe<X>
// export const y: Y = { b: {} }

export default function getSafe <Doc, Requirements extends {}, Output> ({
  db,
  collectionName,
  requirements,
  converter,
  getter
}: {
  db?: Firestore
  collectionName: string
  converter: FirestoreDataConverter<Doc>
  requirements?: Requirements
  getter: ({ collectionRef, requirements }: {
    collectionRef: CollectionReference<Doc>
    requirements: Safe<Requirements>
  }) => Output
}): Output | undefined {
  if (db == null) return undefined
  const r = requirements == null ? {} : requirements
  const collectionRef = convertCollection<Doc>({ db, collectionName, converter })
  function hasAllValues (requirements?: Requirements | {}): requirements is Safe<Requirements> {
    if (requirements == null) return true
    const values = Object.values(requirements)
    const hasAllValues = values.every((value) => value != null)
    return hasAllValues
  }
  if (!hasAllValues(r)) {
    return undefined
  }
  const query = getter({ collectionRef, requirements: r })
  return query
}
