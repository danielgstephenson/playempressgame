import { useContext, ReactNode } from 'react'
import { gameConverter } from '../../service/game'
import { Game } from '../../types'
import dbContext from '../db'
import { DocumentReference, collection, doc } from 'firebase/firestore'
import GameContentView from '../../view/GameContent'
import getFirestream from './getFirestream'

export const { DocStreamer, docContext: gameContext } = getFirestream<Game>()

export default function GameStreamer ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  function getRef (): DocumentReference<Game> | undefined {
    if (dbState.db == null || gameId == null) return undefined
    const gamesRef = collection(dbState.db, 'games')
    const gamesConverted = gamesRef.withConverter(gameConverter)
    const gameRef = doc(gamesConverted, gameId)
    return gameRef
  }
  const ref = getRef()
  return <DocStreamer docRef={ref} View={GameContentView}>{children}</DocStreamer>
}
