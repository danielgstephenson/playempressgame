import { MetaType, Query, Transaction } from 'firelord'
import { Result } from '../types'

export default async function getQuery <Collection extends MetaType> ({ query, transaction }: {
  query: Query<Collection>
  transaction: Transaction
}): Promise<Array<Result<Collection>>> {
  const snapshots = await transaction.get(query)
  const data: Array<Result<Collection>> = []
  snapshots.forEach(snapshot => {
    const datum = snapshot.data()
    data.push({ id: snapshot.id, ...datum })
  })
  return data
}
