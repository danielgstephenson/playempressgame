import { useDisclosure } from '@chakra-ui/react'
import InPlaySchemeButtonView from './InPlaySchemeButton'
import SchemeModal from './SchemeModal'

export default function InPlaySchemeView ({
  rank
}: {
  rank: number
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <InPlaySchemeButtonView rank={rank} onClick={onOpen} />
      <SchemeModal isOpen={isOpen} onClose={onClose} rank={rank} />
    </>
  )
}
