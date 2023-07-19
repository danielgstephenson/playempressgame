import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverMessageView from './PopoverMessage'

export default function PopoverButtonView ({
  label,
  children,
  ...restProps
}: {
  label?: string | number | JSX.Element
  children: ReactNode
} & ButtonProps): JSX.Element {
  const { isOpen, onToggle, onClose } = useDisclosure()
  return (
    <PopoverMessageView
      isOpen={isOpen}
      onClose={onClose}
      trigger={<Button onClick={onToggle} {...restProps}>{label}</Button>}
    >
      {children}
    </PopoverMessageView>
  )
}
