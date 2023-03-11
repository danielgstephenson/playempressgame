import { useContext, ReactNode } from 'react'
import { Game } from '../types'
import dbContext from '../context/db'
import { doc } from 'firebase/firestore'
import GameContentView from '../view/GameContent'
import GameItemView from '../view/GameItem'
import streamChakraFire from '../streamFire/chakra'

export const { DocStreamer, QueryStreamer, docContext: gameContext } = streamChakraFire<Game>({
  collectionName: 'games',
  toFirestore: (game) => {
    return { name: game.name }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    const game = {
      id: snapshot.id,
      name: data.name,
      phase: data.phase,
      timeline: data.timeline,
      court: data.court,
      dungeon: data.dungeon
    }
    return game
  }
})

export function GameStreamer ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const requirements = { gameId }
  return (
    <DocStreamer
      db={dbState.db}
      collectionName='games'
      DocView={GameContentView}
      requirements={requirements}
      getRef={({ collectionRef, requirements }) => {
        const gameRef = doc(collectionRef, requirements.gameId)
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
  return (
    <QueryStreamer
      db={dbState.db}
      collectionName='games'
      DocView={GameItemView}
      getRef={({ collectionRef, requirements }) => {
        return collectionRef
      }}
    >
      {children}
    </QueryStreamer>
  )
}
