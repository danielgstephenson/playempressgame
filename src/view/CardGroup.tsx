import { Heading, HStack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Scheme } from '../types'

export default function CardGroupView ({
  label,
  children,
  cardGroup
}: {
  label: string
  children?: ReactNode
  cardGroup?: Scheme[]
}): JSX.Element {
  const group = cardGroup?.map(scheme => <Text key={scheme.id}>{scheme.rank}</Text>)
  return (
    <>
      <Heading size='sm'>{label}: {children}</Heading>
      <HStack>{group}</HStack>
    </>
  )
}
