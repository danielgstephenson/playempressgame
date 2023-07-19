import { CardProps, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import ExpandedSchemeView from './ExpandedScheme'
import TinyRankedSchemeView from './TinyRankedScheme'

export default function TinyExpandableSchemeView ({
  children,
  rank,
  ...restProps
}: {
  children?: React.ReactNode
  rank: number
} & CardProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <TinyRankedSchemeView
        onClick={onOpen}
        rank={rank}
        {...restProps}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width='auto' onClick={onClose}>
          <ExpandedSchemeView rank={rank} />
        </ModalContent>
      </Modal>
    </>
  )
}
