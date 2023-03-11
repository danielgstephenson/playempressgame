import { useContext, ReactNode } from 'react'
import { gameConverter } from '../service/game'
import { Game } from '../types'
import dbContext from '../context/db'
import { collection, doc } from 'firebase/firestore'
import GameContentView from '../view/GameContent'
import GameItemView from '../view/GameItem'
import streamChakraFire from '../streamFire/chakra'

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
        const gamesRef = collection(requirements.db, 'games')
        const gamesConverted = gamesRef.withConverter(gameConverter)
        const gameRef = doc(gamesConverted, requirements.gameId)
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
        const gamesRef = collection(requirements.db, 'games')
        const gamesConverted = gamesRef.withConverter(gameConverter)
        return gamesConverted
      }}
    >
      {children}
    </QueryStreamer>
  )
}
