import { HStack, Text, VStack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import CircleView from './Circle'

export default function PublicTrashCirclesView (): JSX.Element {
  const profileState = useContext(profileContext)
  if (profileState.trashHistory == null) {
    return <></>
  }
  if (profileState.trashHistory.length === 0) {
    return <Text>Empty</Text>
  }
  const rounds = Array.from(new Set(profileState.trashHistory.map(trashEvent => trashEvent.round)))
  const eventsByRound = rounds.map(round => {
    if (profileState.trashHistory == null) {
      throw new Error('Profile has no trash history')
    }
    return profileState.trashHistory.filter(event => event.round === round)
  })
  const numberByRound = eventsByRound.map(events => events.length)
  const circlesByRound = numberByRound?.map((number, index) => {
    const circles = Array.from({ length: number }, (_, index) => <CircleView key={index} />)
    return (
      <VStack key={index}>
        {circles}
      </VStack>
    )
  })
  return <HStack>{circlesByRound}</HStack>
}
