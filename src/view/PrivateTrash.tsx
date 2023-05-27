import { Box, Heading, HStack, VStack } from '@chakra-ui/react'
import { useContext } from 'react'
import { playerContext } from '../reader/player'

export default function PrivateTrashView (): JSX.Element {
  const playerState = useContext(playerContext)
  const rounds = Array.from(new Set(playerState.trashHistory?.map(trashEvent => trashEvent.round)))
  const eventsByRound = rounds.map(round => playerState.trashHistory?.filter(event => event.round === round))
  const eventRounds = eventsByRound.map((events, index) => {
    const schemes = events?.map((trashEvent, index) => (
      <Box key={trashEvent.scheme.id}>
        {trashEvent.scheme.rank}
      </Box>
    ))
    return (
      <VStack key={index}>
        {schemes}
      </VStack>
    )
  })
  return (
    <>
      <Heading size='sm'>Trash History:</Heading>
      <HStack>{eventRounds}</HStack>
    </>
  )
}
