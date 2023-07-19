import { AccordionButton, AccordionIcon, AccordionItem, AccordionItemProps, AccordionPanel, Box, Heading, Tooltip } from '@chakra-ui/react'
import { HistoryEvent } from '../types'

export default function HistoryEventView ({
  event,
  ...restProps
}: {
  event: HistoryEvent
} & AccordionItemProps): JSX.Element {
  const hasChildren = event.events != null && event.events?.length > 0
  const icon = hasChildren && <AccordionIcon />
  return (
    <>
      <AccordionItem {...restProps}>
        {({ isExpanded }) => {
          const items = isExpanded && event.events?.map((event, index) => (
            <HistoryEventView key={index} event={event} />
          ))
          const panel = hasChildren && <AccordionPanel pb='0'>{items}</AccordionPanel>
          return (
            <>
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
            </>
          )
        }}
      </AccordionItem>
    </>
  )
}
