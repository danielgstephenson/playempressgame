import { ButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import PopoverButtonView from './PopoverButton'

export default function TopPopoverButtonView ({
  label,
  children,
  ...restProps
}: {
  label: string | number
  children: ReactNode
} & ButtonProps): JSX.Element {
  return (
    <PopoverButtonView borderBottomRadius='0' label={label} {...restProps}>
      {children}
    </PopoverButtonView>
  )
}
