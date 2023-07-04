import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function PopoverMessageView ({
  children,
  trigger
}: {
  children: ReactNode
  trigger: ReactNode
}): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger>
        {trigger}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
