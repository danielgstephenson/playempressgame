import { useContext, ReactNode, FC } from 'react'
import { Game } from '../types'
import dbContext from '../context/db'
import { doc, orderBy, query } from 'firebase/firestore'
import createChakraReaders from '../lib/fireread/createReaders/chakra'

export const {
  DocReader,
  QueryReader,
  docContext: gameContext
} = createChakraReaders<Game>({
  collectionName: 'games',
  toFirestore: (game) => {
    return {
      name: game.name,
      phase: game.phase,
      timeline: game.timeline,
      court: game.court,
      dungeon: game.dungeon,
      createdAt: game.createdAt,
      userIds: game.userIds
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    const game = {
      id: snapshot.id,
      name: data.name,
      phase: data.phase,
      timeline: data.timeline,
      court: data.court,
      dungeon: data.dungeon,
      createdAt: data.createdAt,
      userIds: data.userIds
    }
    return game
  }
})

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
