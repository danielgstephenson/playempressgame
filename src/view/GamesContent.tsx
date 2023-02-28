import { Stack } from '@chakra-ui/react'
import { collection, CollectionReference } from 'firebase/firestore'
import { useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import dbContext from '../context/db'
import { gameConverter } from '../service/game'
import GameItemView from './GameItem'
import Viewer from './Viewer'
import { Game } from '../types'

export default function GamesContentView (): JSX.Element {
  const dbState = useContext(dbContext)
  function getRef (): CollectionReference<Game> | null {
    if (dbState.db == null) return null
    const gamesRef = collection(dbState.db, 'games')
    const gamesConverted = gamesRef.withConverter(gameConverter)
    return gamesConverted
  }
  const ref = getRef()
  const gamesStream = useCollectionData(ref)
  return (
    <Stack>
      <Viewer stream={gamesStream} View={GameItemView} />
    </Stack>
  )
}
