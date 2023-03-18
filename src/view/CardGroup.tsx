import { Heading, HStack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function CardGroupView ({
  label,
  children,
  cardGroup
}: {
  label: string
  children?: ReactNode
  cardGroup?: number[]
}): JSX.Element {
  const group = cardGroup?.map((rank, index) => <Text key={index}>{rank}</Text>)
  return (
    <>
      <Heading size='sm'>{label}: {children}</Heading>
      <HStack>{group}</HStack>
    </>
  )
}
