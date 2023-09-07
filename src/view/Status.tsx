import { HStack, Heading, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function StatusView ({ children, label }: {
  children: ReactNode
  label: string
}): JSX.Element {
  const child = children == null ? 'Empty' : children
  return (
    <HStack alignItems='baseline' width='max-content'>
      <Heading size='sm'>{label}:</Heading>
      <Text width='max-content' lineHeight='1'>{child}</Text>
    </HStack>
  )
}
