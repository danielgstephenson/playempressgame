import { doc } from 'firebase/firestore'
import { FC, ReactNode, useContext } from 'react'
import { Player } from '../types'
import dbContext from '../context/db'
import createChakraReaders from '../lib/fireread/createReaders/chakra'
import { gameContext } from './game'
import profileContext from '../context/profile'

export const {
  DocReader,
  docContext: playerContext
} = createChakraReaders<Player>({ collectionName: 'players' })

export default function PlayerReader ({
  children,
  DocView
}: {
  children?: ReactNode
  DocView: FC
}): JSX.Element {
  const profileState = useContext(profileContext)
  const gameState = useContext(gameContext)
  const dbState = useContext(dbContext)
  const requirements = { gameId: gameState.id, userId: profileState.userId }
  return (
    <DocReader
      DocView={DocView}
      db={dbState.db}
      requirements={requirements}
      getDocRef={({ collectionRef, requirements }) => {
        const playerId = `${requirements.userId}_${requirements.gameId}`
        const docRef = doc(collectionRef, playerId)
        return docRef
      }}
    >
      {children}
    </DocReader>
  )
}
