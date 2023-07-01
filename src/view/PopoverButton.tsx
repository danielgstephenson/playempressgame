import { Popover, PopoverTrigger, Button, PopoverContent, PopoverArrow, PopoverBody, ButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function PopoverButtonView ({
  label,
  children,
  ...restProps
}: {
  label?: string | number
  children: ReactNode
} & ButtonProps): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger>
        <Button disabled {...restProps}>{label}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
