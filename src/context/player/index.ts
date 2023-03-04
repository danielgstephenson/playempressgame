import { createContext } from 'react'
import { QuerySnapshot, FirestoreError } from 'firebase/firestore'
import { Player } from '../../types'

export interface PlayerState {
  playerStream?: [Player | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Player> | undefined]
  player?: Player
  playerLoading?: Boolean
  playerError?: FirestoreError
}

const playerContext = createContext<PlayerState>({})
export default playerContext
