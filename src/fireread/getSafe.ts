import { Firestore, FirestoreDataConverter } from 'firebase/firestore'
import convertCollection from './convertCollection'
import { GetterProps, Safe } from './types'

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
  getter: (props: GetterProps<Doc, Requirements>) => Output
}): Output | null {
  if (db == null) return null
  const collectionRef = convertCollection<Doc>({ db, collectionName, converter })
  const r = requirements == null ? {} : requirements
  function hasAllValues (requirements?: Requirements | {}): requirements is Safe<Requirements> {
    if (requirements == null) return true
    const values = Object.values(requirements)
    const hasAllValues = values.every((value) => value != null)
    return hasAllValues
  }
  if (!hasAllValues(r)) {
    return null
  }
  console.log(r)
  const query = getter({ collectionRef, requirements: r })
  return query
}
