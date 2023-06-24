import { Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function SchemesContainerView ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <Flex
      flexWrap='wrap'
      gap='2px'
      rowGap='2px'
    >
      {children}
    </Flex>
  )
}
