import { CardProps, Heading, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import getBg from '../service/getBg'
import ExpandedSchemeView from './ExpandedScheme'
import TinySchemeView from './TinyScheme'

export default function TinyExpandableSchemeView ({
  children,
  rank,
  ...restProps
}: {
  children?: React.ReactNode
  rank: number
} & CardProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (rank == null) {
    return (
      <TinySchemeView bg='gray' />
    )
  }
  const bg = getBg({ rank })
  return (
    <>
      <TinySchemeView
        bg={bg}
        onClick={onOpen}
        {...restProps}
      >
        <Heading size='xs' fontSize='xs'>{rank}</Heading>
      </TinySchemeView>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width='auto' onClick={onClose}>
          <ExpandedSchemeView
            rank={rank}
          >
            {children}
          </ExpandedSchemeView>
        </ModalContent>
      </Modal>
    </>
  )
}
