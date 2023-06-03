import { useContext } from 'react'
import { Heading } from '@chakra-ui/react'
import { playerContext } from '../reader/player'
import HistoryView from './History'

export default function PlayerHistoryView (): JSX.Element {
  const playerState = useContext(playerContext)
  return (
    <>
      <HistoryView events={playerState.events}>
        <Heading size='sm'>Player History</Heading>
      </HistoryView>
    </>
  )
}
