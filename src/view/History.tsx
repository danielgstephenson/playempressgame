import { ReactNode, useRef } from 'react'
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
  const items = history?.map((event, index) => {
    const styles = index === history.length - 1 ? { bg: 'gray.600' } : {}
    return (
      <HistoryEventView event={event} key={index} {...styles} />
    )
  }).reverse()
  // Scroll to bottom
  // useEffect(() => {
  //   if (ref.current == null) return
  //   ref.current.scrollTop = ref.current.scrollHeight
  // }, [history])
  return (
    <Accordion allowToggle defaultIndex={0} height='100%' overflowY='auto' ref={ref}>
      <AccordionItem>
        <Heading
          size='sm'
          position='sticky'
          top='0px'
          outline='1px solid #3f444e'
          bg='var(--chakra-colors-chakra-body-bg)'
        >
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              {children}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel p='0'>
          <Accordion allowMultiple>
            {items}
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
