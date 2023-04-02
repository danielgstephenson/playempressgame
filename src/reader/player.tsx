import { doc } from 'firebase/firestore'
import { FC, ReactNode, useContext } from 'react'
import { Player } from '../types'
import dbContext from '../context/db'
import { profileContext } from './profile'
import createChakraReaders from '../lib/fireread/createReaders/chakra'

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
  const dbState = useContext(dbContext)
  const requirements = { gameId: profileState.gameId, userId: profileState.userId }
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
