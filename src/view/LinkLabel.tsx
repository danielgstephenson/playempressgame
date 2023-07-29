import { Text } from '@chakra-ui/react'

export default function LinkLabelView ({
  label
}: {
  label: string
}): JSX.Element {
  const [, domain, third] = label.split('.')
  const [tld] = third.split('/')
  const text = `${domain}.${tld}`
  return <Text>{text}</Text>
}
