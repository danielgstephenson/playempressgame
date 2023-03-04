import { createContext } from 'react'
import { FirestoreError, QuerySnapshot } from 'firebase/firestore'
import { Game } from '../../types'

export interface GamesState {
  gamesStream?: [Game[] | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Game> | undefined]
  games?: Game[]
  gamesLoading?: Boolean
  gamesError?: FirestoreError
}

const gamesContext = createContext<GamesState>({})
export default gamesContext
