import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverMessageView from './PopoverMessage'

export default function PopoverIconButtonView ({
  children,
  ...restProps
}: {
  children: ReactNode
} & IconButtonProps): JSX.Element {
  return (
    <PopoverMessageView trigger={<IconButton {...restProps} />}>
      {children}
    </PopoverMessageView>
  )
}
