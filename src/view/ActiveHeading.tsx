import { Heading } from '@chakra-ui/react'

export default function ActiveHeading ({
  active = false,
  children
}: {
  active?: boolean
  children?: React.ReactNode
}): JSX.Element {
  const fontWeight = active ? '1000' : undefined
  return <Heading fontWeight={fontWeight} size='sm'>{children}</Heading>
}
