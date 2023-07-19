import { CardProps, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { forwardRef } from 'react'
import CollapsedSchemeView from './CollapsedScheme'
import ExpandedSchemeView from './ExpandedScheme'

function View ({
  active = false,
  isDragging,
  rank,
  ...cardProps
}: {
  active?: boolean
  isDragging?: boolean
  rank: number
} &
CardProps,
ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <CollapsedSchemeView
        active={active}
        ref={ref}
        onClick={onOpen}
        rank={rank}
        size='sm'
        {...cardProps}
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
const ExpandableSchemeView = forwardRef(View)
export default ExpandableSchemeView
