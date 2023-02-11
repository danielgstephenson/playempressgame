import { Firestore } from 'firebase/firestore'
import { ReactNode } from 'react'
import dbContext, { DbState } from '.'

export default function DbProvider ({
  db,
  children
}: {
  db: Firestore
  children: ReactNode
}): JSX.Element {
  const state: DbState = { db }

  return (
    <dbContext.Provider value={state}>
      {children}
    </dbContext.Provider>
  )
}
