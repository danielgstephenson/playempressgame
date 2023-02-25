import { collection, doc, DocumentReference } from 'firebase/firestore'
import { useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import dbContext from '../context/db'
import { gameConverter } from '../service/game'
import { Game } from '../types'
import GameContentView from './GameContent'
import Viewer from './Viewer'

export default function GameViewer ({ gameId }: { gameId: string }): JSX.Element {
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
  return <Viewer stream={gameStream} View={GameContentView} />
}
