import { ReactNode } from 'react'
import { Accordion } from '@chakra-ui/react'
import HistoryEventView from './HistoryEvent'
import { HistoryEvent } from '../types'

export default function HistoryView ({
  history,
  children
}: {
  history?: HistoryEvent[]
  children?: ReactNode
}): JSX.Element {
  const items = history?.map((event, index) => (
    <HistoryEventView event={event} key={index} />
  ))
  return (
    <>
      {children}
      <Accordion allowMultiple>
        {items}
      </Accordion>
    </>
  )
}
