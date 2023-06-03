import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import HistoryView from './History'

export default function GameHistoryView (): JSX.Element {
  const gameState = useContext(gameContext)
  return (
    <>
      <HistoryView events={gameState.events}>
        <Heading size='md'>Game History</Heading>
      </HistoryView>
    </>
  )
}
