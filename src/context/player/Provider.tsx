import { collection, Query, query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import playerContext, { PlayerState } from '.'
import { playerConverter } from '../../service/player'
import { Player } from '../../types'
import dbContext from '../db'
import profileContext from '../profile'

export default function PlayerProvider ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const profileState = useContext(profileContext)
  const dbState = useContext(dbContext)
  function getRef (): Query<Player> | null {
    if (dbState.db == null || profileState.gameId == null || profileState.userId == null) return null
    const playersCollection = collection(dbState.db, 'players')
    const playersConverted = playersCollection.withConverter(playerConverter)
    const whereGame = where('gameId', '==', profileState.gameId)
    const whereUser = where('userId', '==', profileState.userId)
    const q = query(playersConverted, whereGame, whereUser)
    return q
  }
  const ref = getRef()
  const playersStream = useCollectionData<Player>(ref)
  console.log('playersStream test:', playersStream)
  const [players, playerLoading, playerError, playerSnapshot] = playersStream
  const player = players == null ? undefined : players[0]
  const playerStream: PlayerState['playerStream'] = [player, playerLoading, playerError, playerSnapshot]
  const state: PlayerState = {
    playerStream,
    player,
    playerLoading,
    playerError
  }

  return (
    <playerContext.Provider value={state}>
      {children}
    </playerContext.Provider>
  )
}
