import { Query, collection } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { gameConverter } from '../../service/game'
import { Game } from '../../types'
import GameItemView from '../../view/GameItem'
import dbContext from '../db'
import getFirestream from './getFirestream'

export const { QueryStreamer, queryContext: gamesContext } = getFirestream<Game>()

export default function GamesStreamer ({
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
