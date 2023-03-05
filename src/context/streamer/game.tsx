import { createContext, useContext, ReactNode } from 'react'
import { gameConverter } from '../../service/game'
import { Game } from '../../types'
import dbContext from '../db'
import { DocumentSnapshot, FirestoreError, DocumentReference, collection, doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import DocViewer from '../../view/viewer/Doc'
import GameContentView from '../../view/GameContent'

export interface GameState extends Partial<Game>{
  game?: Game
}

export const gameContext = createContext<GameState>({})

export interface GameStreamState {
  gameStream?: [Game | undefined, boolean, FirestoreError | undefined, DocumentSnapshot<Game> | undefined]
  game?: Game
  gameLoading?: Boolean
  gameError?: FirestoreError
}

export function GameProvider ({
  game,
  children
}: {
  game?: Game
  children: ReactNode
}): JSX.Element {
  const state: GameState = game == null ? { game } : { game, ...game }

  return (
    <gameContext.Provider value={state}>
      {children}
    </gameContext.Provider>
  )
}

export const gameStreamContext = createContext<GameStreamState>({})

export function GameViewer (): JSX.Element {
  const gameStreamState = useContext(gameStreamContext)
  if (gameStreamState.gameStream == null) return <></>
  return <DocViewer stream={gameStreamState.gameStream} View={GameContentView} />
}

export default function GameStreamer ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  function getRef (): DocumentReference<Game> | null {
    if (dbState.db == null || gameId == null) return null
    const gamesRef = collection(dbState.db, 'games')
    const gamesConverted = gamesRef.withConverter(gameConverter)
    const gameRef = doc(gamesConverted, gameId)
    return gameRef
  }
  const ref = getRef()
  const gameStream = useDocumentData<Game>(ref)
  const [game, gameLoading, gameError] = gameStream
  console.log('gameStreamer game test:', game)

  const state: GameStreamState = { gameStream, game, gameLoading, gameError }

  return (
    <gameStreamContext.Provider value={state}>
      <GameProvider game={game}>
        {children}
        <GameViewer />
      </GameProvider>
    </gameStreamContext.Provider>
  )
}
