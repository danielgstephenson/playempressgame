import { VStack, HStack } from '@chakra-ui/react'
import { PrivateTrashEvent } from '../types'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function TrashHistoryView ({ history }: {
  history?: PrivateTrashEvent[]
}): JSX.Element {
  const rounds = Array.from(new Set(history?.map(trashEvent => trashEvent.round)))
  const eventsByRound = rounds.map(round => history?.filter(event => event.round === round))
  if (eventsByRound.length === 0) {
    return <></>
  }
  const eventRounds = eventsByRound.map((events, index) => {
    const schemes = events?.map((trashEvent) => (
      <TinyExpandableSchemeView key={trashEvent.scheme.id} rank={trashEvent.scheme.rank} />
    ))
    return (
      <VStack key={index} spacing='2px'>
        {schemes}
      </VStack>
    )
  })
  // return <>xyz {eventRounds}</>
  return <HStack spacing='2px'>{eventRounds}</HStack>
}
