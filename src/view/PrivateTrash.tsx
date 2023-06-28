import { Box, HStack, VStack } from '@chakra-ui/react'
import { useContext } from 'react'
import { SCHEME_WIDTH } from '../constants'
import playContext from '../context/play'
import { playerContext } from '../reader/player'
import ActiveHeading from './ActiveHeading'
import TinySchemeView from './TinyScheme'
import TrashAreaView from './TrashArea'

export default function PrivateTrashView (): JSX.Element {
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const rounds = Array.from(new Set(playerState.trashHistory?.map(trashEvent => trashEvent.round)))
  const eventsByRound = rounds.map(round => playerState.trashHistory?.filter(event => event.round === round))
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
  const history = eventsByRound.length > 0
    ? <HStack spacing='2px'>{eventRounds}</HStack>
    : undefined
  return (
    <Box minW={SCHEME_WIDTH}>
      <ActiveHeading active={playState.overTrash}>Trash</ActiveHeading>
      <HStack spacing='2px' alignItems='start'>
        {history}
        <TrashAreaView />
      </HStack>
    </Box>
  )
}
