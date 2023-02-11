import { createContext } from 'react'
import { Firestore } from 'firebase/firestore'

export interface DbState {
  db?: Firestore
}

const dbContext = createContext<DbState>({})
export default dbContext
