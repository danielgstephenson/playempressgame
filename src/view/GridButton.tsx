import { Button, ButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function GridButtonView ({
  children,
  ...restProps
}: {
  children?: ReactNode
} & ButtonProps): JSX.Element {
  return (
    <Button size='xs' borderRadius='0' {...restProps}>
      {children}
    </Button>
  )
}
