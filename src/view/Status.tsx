import { HStack, Heading, Text } from '@chakra-ui/react'

export default function StatusView ({ label, value }: {
  label: string
  value?: string | number | boolean
}): JSX.Element {
  const valueString = value == null ? 'Empty' : value?.toString()
  return (
    <HStack alignItems='baseline' width='max-content'>
      <Heading size='sm'>{label}:</Heading>
      <Text width='max-content' lineHeight='1'>{valueString}</Text>
    </HStack>
  )
}
