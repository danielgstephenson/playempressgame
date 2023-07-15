import { Button, ButtonProps } from '@chakra-ui/react'
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
  return (
    <PopoverMessageView trigger={<Button {...restProps}>{label}</Button>}>
      {children}
    </PopoverMessageView>
  )
}
