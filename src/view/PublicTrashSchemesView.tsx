import { HStack, Text, VStack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import SomeTinySchemeView from './SomeTinyScheme'

export default function PublicTrashSchemesView (): JSX.Element {
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
  const schemesByRound = numberByRound?.map((number, index) => {
    const schemes = Array.from({ length: number }, (_, index) => <SomeTinySchemeView key={index} />)
    return (
      <VStack key={index}>
        {schemes}
      </VStack>
    )
  })
  return <HStack>{schemesByRound}</HStack>
}
