import { useContext, ReactNode } from 'react'
import { Game } from '../types'
import dbContext from '../context/db'
import { doc } from 'firebase/firestore'
import GameContentView from '../view/GameContent'
import GameItemView from '../view/GameItem'
import streamChakraFire from '../streamFire/chakra'
import getGamesRef from '../service/game'

export const { DocStreamer, QueryStreamer, docContext: gameContext } = streamChakraFire<Game>()

export function GameStreamer ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const requirements = { db: dbState.db, gameId }
  return (
    <DocStreamer
      DocView={GameContentView}
      requirements={requirements}
      getRef={(requirements) => {
        const gamesRef = getGamesRef(requirements.db)
        const gameRef = doc(gamesRef, requirements.gameId)
        return gameRef
      }}
    >
      {children}
    </DocStreamer>
  )
}

export function GamesStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const requirements = { db: dbState.db }
  return (
    <QueryStreamer
      DocView={GameItemView}
      requirements={requirements}
      getRef={(requirements) => {
        const gamesRef = getGamesRef(requirements.db)
        return gamesRef
      }}
    >
      {children}
    </QueryStreamer>
  )
}
