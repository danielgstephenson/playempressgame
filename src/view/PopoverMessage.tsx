import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverBodyProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function PopoverMessageView ({
  children,
  trigger,
  ...restProps
}: {
  children: ReactNode
  trigger: ReactNode
} & PopoverBodyProps): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger>
        {trigger}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody {...restProps}>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
