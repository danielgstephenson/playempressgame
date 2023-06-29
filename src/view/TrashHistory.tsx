import { VStack, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import { playerContext } from '../reader/player'
import TinySchemeView from './TinyScheme'

export default function TrashHistoryView (): JSX.Element {
  const playerState = useContext(playerContext)
  const rounds = Array.from(new Set(playerState.trashHistory?.map(trashEvent => trashEvent.round)))
  const eventsByRound = rounds.map(round => playerState.trashHistory?.filter(event => event.round === round))
  if (eventsByRound.length === 0) {
    return <></>
  }
  const eventRounds = eventsByRound.map((events, index) => {
    const schemes = events?.map((trashEvent, index) => (
      <TinySchemeView key={trashEvent.scheme.id} rank={trashEvent.scheme.rank} />
    ))
    return (
      <VStack key={index}>
        {schemes}
      </VStack>
    )
  })
  return <HStack spacing='2px'>{eventRounds}</HStack>
}
