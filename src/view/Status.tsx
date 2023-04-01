import { HStack, Heading, Text } from '@chakra-ui/react'

export default function StatusView ({ label, value }: {
  label: string
  value?: string | number
}): JSX.Element {
  return (
    <HStack alignItems='baseline'>
      <Heading size='sm'>{label}:</Heading>
      <Text lineHeight='1'>{value}</Text>
    </HStack>
  )
}
