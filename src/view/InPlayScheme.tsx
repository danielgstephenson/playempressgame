import { useDisclosure } from '@chakra-ui/react'
import InPlaySchemeButtonView from './InPlaySchemeButton'
import SchemeModal from './SchemeModal'

export default function InPlaySchemeView ({
  id,
  rank
}: {
  id: string
  rank: number
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <InPlaySchemeButtonView id={id} rank={rank} onClick={onOpen} />
      <SchemeModal isOpen={isOpen} onClose={onClose} rank={rank} />
    </>
  )
}
