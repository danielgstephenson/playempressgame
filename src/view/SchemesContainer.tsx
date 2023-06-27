import { Flex, FlexProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function SchemesContainerView ({
  children,
  ...otherProps
}: {
  children: ReactNode
} & FlexProps): JSX.Element {
  return (
    <Flex
      flexWrap='wrap'
      gap='2px'
      rowGap='2px'
      {...otherProps}
    >
      {children}
    </Flex>
  )
}
