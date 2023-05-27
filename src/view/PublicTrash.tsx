import { Box, Heading, HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'

export default function PublicTrashView (): JSX.Element {
  const profileState = useContext(profileContext)
  const rounds = Array.from(new Set(profileState.trashHistory?.map(trashEvent => trashEvent.round)))
  const eventsByRound = rounds.map(round => profileState.trashHistory?.filter(event => event.round === round))
  const numberByRound = eventsByRound.map(events => events?.length)
  const boxesByRound = numberByRound?.map((number, index) => {
    return (
      <Box key={index}>
        {number}
      </Box>
    )
  })
  return (
    <>
      <Heading size='sm'>Trash History:</Heading>
      <HStack>{boxesByRound}</HStack>
    </>
  )
}
