import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverBodyProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function PopoverMessageView ({
  children,
  isOpen,
  onClose,
  trigger,
  ...restProps
}: {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  trigger: ReactNode
} & PopoverBodyProps): JSX.Element {
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        {trigger}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody {...restProps} onClick={onClose}>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
