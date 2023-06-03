import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading, Tooltip } from '@chakra-ui/react'
import { HistoryEvent } from '../types'

export default function HistoryEventView ({
  event
}: {
  event: HistoryEvent
}): JSX.Element {
  const items = event.events?.map((event, index) => (
    <HistoryEventView key={index} event={event} />
  ))
  const hasChildren = event.events != null && event.events?.length > 0
  const icon = hasChildren && <AccordionIcon />
  const panel = hasChildren && <AccordionPanel>{items}</AccordionPanel>
  return (
    <>
      <AccordionItem>
        <Heading size='sm'>
          <AccordionButton>
            <Tooltip label={<>{event.timestamp}</>}>
              <Box as='span' flex='1' textAlign='left'>
                {event.message}
              </Box>
            </Tooltip>
            {icon}
          </AccordionButton>
        </Heading>
        {panel}
      </AccordionItem>
    </>
  )
}
