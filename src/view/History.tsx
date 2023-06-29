import { ReactNode, useEffect, useRef } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading } from '@chakra-ui/react'
import HistoryEventView from './HistoryEvent'
import { HistoryEvent } from '../types'

export default function HistoryView ({
  events: history,
  children
}: {
  events?: HistoryEvent[]
  children?: ReactNode
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const items = history?.map((event, index) => (
    <HistoryEventView event={event} key={index} />
  ))
  // Scroll to bottom
  useEffect(() => {
    if (ref.current == null) return
    ref.current.scrollTop = ref.current.scrollHeight
  }, [history])
  return (
    <Accordion allowToggle defaultIndex={0}>
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
          <Accordion
            ref={ref}
            allowMultiple height='140px'
            overflowY='scroll'
          >
            {items}
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
