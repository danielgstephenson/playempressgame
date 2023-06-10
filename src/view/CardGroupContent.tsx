import { HStack, Text } from '@chakra-ui/react'
import { Scheme } from '../types'

export default function CardGroupContentView ({
  cardGroup
}: {
  cardGroup?: Scheme[]
}): JSX.Element {
  // console.log('cardGroup', cardGroup)
  if (cardGroup == null || cardGroup.length === 0) {
    return <Text>Empty</Text>
  }
  const group = cardGroup?.map(scheme => <Text key={scheme.id}>{scheme.rank}</Text>)
  return <HStack flexWrap='wrap'>{group}</HStack>
}
