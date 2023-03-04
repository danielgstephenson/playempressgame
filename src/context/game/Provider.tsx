import { collection, doc, DocumentReference } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import gameContext, { GameState } from '.'
import { gameConverter } from '../../service/game'
import { Game } from '../../types'
import dbContext from '../db'

export default function GameProvider ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  function getRef (): DocumentReference<Game> | null {
    if (dbState.db == null || gameId == null) return null
    const gamesRef = collection(dbState.db, 'games')
    const gamesConverted = gamesRef.withConverter(gameConverter)
    const gameRef = doc(gamesConverted, gameId)
    return gameRef
  }
  const ref = getRef()
  const gameStream = useDocumentData<Game>(ref)
  const [game, gameLoading, gameError] = gameStream

  const state: GameState = { gameStream, game, gameLoading, gameError }

  return (
    <gameContext.Provider value={state}>
      {children}
    </gameContext.Provider>
  )
}
