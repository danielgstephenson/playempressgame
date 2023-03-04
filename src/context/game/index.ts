import { createContext } from 'react'
import { DocumentSnapshot, FirestoreError } from 'firebase/firestore'
import { Game } from '../../types'

export interface GameState {
  gameStream?: [Game | undefined, boolean, FirestoreError | undefined, DocumentSnapshot<Game> | undefined]
  game?: Game
  gameLoading?: Boolean
  gameError?: FirestoreError
}

const gameContext = createContext<GameState>({})
export default gameContext
