import { collection, Query, query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import dbContext from '../db'
import { Profile } from '../../types'
import gameContext from '../game'
import { profileConverter } from '../../service/profile'
import profilesContext, { ProfilesState } from '.'

export default function ProfilesProvider ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const gameState = useContext(gameContext)
  function getQuery (): Query<Profile> | null {
    if (dbState.db == null || gameState.game?.id == null) return null
    const profilesCollection = collection(dbState.db, 'profiles')
    const profilesConverted = profilesCollection.withConverter(profileConverter)
    const q = query(profilesConverted, where('gameId', '==', gameState.game?.id))
    return q
  }
  const q = getQuery()
  const profilesStream = useCollectionData(q)
  const [profiles, profilesLoading, profilesError] = profilesStream
  const state: ProfilesState = { profilesStream, profiles, profilesLoading, profilesError }

  return (
    <profilesContext.Provider value={state}>
      {children}
    </profilesContext.Provider>
  )
}
