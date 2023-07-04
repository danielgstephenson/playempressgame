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
    <Box bg='black' p='20px' flex='1' height='100%' overflow='scroll'>
      <Box bg='gray' height='1000px' display='flex' flexDirection='column' justifyContent='space-between'>
        <Box>Start</Box>
        <Box>End</Box>
      </Box>
    </Box>
  )
  return (
    <Accordion allowToggle defaultIndex={0} flexGrow='1' height='100%'>
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
            allowMultiple
            overflowY='scroll'
          >
            {items}
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
