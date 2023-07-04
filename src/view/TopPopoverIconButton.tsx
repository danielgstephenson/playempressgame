import { IconButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverIconButtonView from './PopoverIconButton'

export default function TopPopoverIconButtonView ({
  children,
  ...restProps
}: {
  children: ReactNode
} & IconButtonProps): JSX.Element {
  return (
    <PopoverIconButtonView borderBottomRadius='0' {...restProps}>
      {children}
    </PopoverIconButtonView>
  )
}
