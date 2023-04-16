import { ReactNode } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading } from '@chakra-ui/react'
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
    <Accordion allowToggle>
      <AccordionItem>
        <Heading size='sm'>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              {children}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
          <Accordion allowMultiple>
            {items}
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
