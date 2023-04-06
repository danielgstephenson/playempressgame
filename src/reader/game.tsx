import { useContext, ReactNode, FC } from 'react'
import { Game } from '../types'
import dbContext from '../context/db'
import { doc, orderBy, query } from 'firebase/firestore'
import createChakraReaders from '../lib/fireread/createReaders/chakra'

export const {
  DocReader,
  QueryReader,
  docContext: gameContext
} = createChakraReaders<Game>({ collectionName: 'games' })

export function GameReader ({
  gameId,
  children,
  DocView
}: {
  gameId: string
  children?: ReactNode
  DocView: FC
}): JSX.Element {
  const dbState = useContext(dbContext)
  const requirements = { gameId }
  return (
    <DocReader
      db={dbState.db}
      DocView={DocView}
      requirements={requirements}
      getDocRef={({ collectionRef, requirements }) => {
        const gameRef = doc(collectionRef, requirements.gameId)
        return gameRef
      }}
    >
      {children}
    </DocReader>
  )
}

export function GamesReader ({
  children,
  DocView
}: {
  children?: ReactNode
  DocView: FC
}): JSX.Element {
  const dbState = useContext(dbContext)
  return (
    <QueryReader
      db={dbState.db}
      DocView={DocView}
      getQuery={({ collectionRef }) => {
        const order = orderBy('createdAt', 'desc')
        return query(collectionRef, order)
      }}
    >
      {children}
    </QueryReader>
  )
}
