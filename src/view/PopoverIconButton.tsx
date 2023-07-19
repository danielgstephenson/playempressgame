import { IconButton, IconButtonProps, useDisclosure } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverMessageView from './PopoverMessage'

export default function PopoverIconButtonView ({
  children,
  ...restProps
}: {
  children: ReactNode
} & IconButtonProps): JSX.Element {
  const { isOpen, onToggle, onClose } = useDisclosure()
  return (
    <PopoverMessageView isOpen={isOpen} onClose={onClose} trigger={<IconButton onClick={onToggle} {...restProps} />}>
      {children}
    </PopoverMessageView>
  )
}
