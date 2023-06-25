import { Modal, ModalContent, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react'
import { forwardRef } from 'react'
import ExpandedSchemeView from './ExpandedScheme'
import RankCircleView from './RankCircle'

function View ({
  children,
  rank
}: {
  children?: React.ReactNode
  rank: number
},
ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <VStack direction='column'>
        <RankCircleView
          onClick={onOpen}
          rank={rank}
          ref={ref}
        />
        {children}
      </VStack>

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
const CircleSchemeView = forwardRef(View)
export default CircleSchemeView
