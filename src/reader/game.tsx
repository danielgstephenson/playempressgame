import { useContext, ReactNode } from 'react'
import { Game } from '../types'
import dbContext from '../context/db'
import { doc } from 'firebase/firestore'
import GameContentView from '../view/GameContent'
import GameItemView from '../view/GameItem'
import firereaderChakra from '../firereader/chakra'

export const {
  DocReader,
  QueryReader,
  docContext: gameContext
} = firereaderChakra<Game>({
  collectionName: 'games',
  toFirestore: (game) => {
    return {
      name: game.name,
      phase: game.phase,
      timeline: game.timeline,
      court: game.court,
      dungeon: game.dungeon
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
    <DocReader
      db={dbState.db}
      DocView={GameContentView}
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

export function GamesStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  return (
    <QueryReader db={dbState.db} DocView={GameItemView}>
      {children}
    </QueryReader>
  )
}
