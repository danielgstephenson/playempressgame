import { VStack, HStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { PrivateTrashEvent } from '../types'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function TrashHistoryView ({
  children,
  history
}: {
  children?: ReactNode
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
    const area = index === eventsByRound.length - 1 && children
    return (
      <VStack alignItems='start' key={index} spacing='2px'>
        {schemes}
        {area}
      </VStack>
    )
  })
  return <HStack spacing='2px'>{eventRounds}</HStack>
}
