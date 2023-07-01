import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react'
import ExpandedSchemeView from './ExpandedScheme'

export default function SchemeModal ({
  isOpen,
  onClose,
  rank
}: {
  isOpen: boolean
  onClose: () => void
  rank: number
}): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent width='auto' onClick={onClose}>
        <ExpandedSchemeView rank={rank} />
      </ModalContent>
    </Modal>
  )
}
