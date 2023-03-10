import { useContext, ReactNode } from 'react'
import { gameConverter } from '../service/game'
import { Game } from '../types'
import dbContext from '../context/db'
import { collection, doc } from 'firebase/firestore'
import GameContentView from '../view/GameContent'
import GameItemView from '../view/GameItem'
import streamChakraFire from '../streamFire/chakra'
import getSafe from './getSafe'

export const { DocStreamer, QueryStreamer, docContext: gameContext } = streamChakraFire<Game>()

export function GameStreamer ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const ref = getSafe({
    needs: { db: dbState.db, gameId },
    getter: (needs) => {
      const gamesRef = collection(needs.db, 'games')
      const gamesConverted = gamesRef.withConverter(gameConverter)
      const gameRef = doc(gamesConverted, gameId)
      return gameRef
    }
  })
  return <DocStreamer docRef={ref} DocView={GameContentView}>{children}</DocStreamer>
}

export function GamesStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const query = getSafe({
    needs: { db: dbState.db },
    getter: (needs) => {
      const gamesRef = collection(needs.db, 'games')
      const gamesConverted = gamesRef.withConverter(gameConverter)
      return gamesConverted
    }
  })
  return <QueryStreamer DocView={GameItemView} queryRef={query}>{children}</QueryStreamer>
}
