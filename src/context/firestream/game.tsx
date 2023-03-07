import { useContext, ReactNode } from 'react'
import { gameConverter } from '../../service/game'
import { Game } from '../../types'
import dbContext from '../db'
import { DocumentReference, collection, doc, Query } from 'firebase/firestore'
import GameContentView from '../../view/GameContent'
import firestream from '.'
import GameItemView from '../../view/GameItem'

export const { DocStreamer, QueryStreamer, docContext: gameContext } = firestream<Game>()

export function GameStreamer ({
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

export function GamesStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  function getQuery (): Query<Game> | undefined {
    if (dbState.db == null) return undefined
    const gamesRef = collection(dbState.db, 'games')
    const gamesConverted = gamesRef.withConverter(gameConverter)
    return gamesConverted
  }
  const q = getQuery()
  return <QueryStreamer View={GameItemView} queryRef={q}>{children}</QueryStreamer>
}
