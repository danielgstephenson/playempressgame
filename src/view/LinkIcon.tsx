import { Image } from '@chakra-ui/react'

export default function LinkIconView ({
  src
}: {
  src: string
}): JSX.Element {
  return <Image src={src} h='16px' />
}
