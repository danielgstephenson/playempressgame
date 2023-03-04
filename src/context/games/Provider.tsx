import { collection, CollectionReference } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { gameConverter } from '../../service/game'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Game } from '../../types'
import dbContext from '../db'
import gamesContext, { GamesState } from '.'

export default function GamesProvider ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  function getRef (): CollectionReference<Game> | null {
    if (dbState.db == null) return null
    const gamesRef = collection(dbState.db, 'games')
    const gamesConverted = gamesRef.withConverter(gameConverter)
    return gamesConverted
  }
  const ref = getRef()
  const gamesStream = useCollectionData(ref)
  const [games, gamesLoading, gamesError] = gamesStream
  const state: GamesState = { gamesStream, games, gamesLoading, gamesError }

  return (
    <gamesContext.Provider value={state}>
      {children}
    </gamesContext.Provider>
  )
}
