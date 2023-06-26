import { Card, CardBody, Center, Heading, Modal, ModalContent, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react'
import { forwardRef } from 'react'
import getBg from '../service/getBg'
import ExpandedSchemeView from './ExpandedScheme'

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
  const bg = getBg({ rank })
  return (
    <>
      <VStack direction='column'>
        <Card
          bg={bg}
          onClick={onOpen}
          ref={ref}
        >
          <CardBody p='0' w='18px'>
            <Center minH='24px'>
              <Heading size='xs' fontSize='xs'>{rank}</Heading>
            </Center>
          </CardBody>
        </Card>
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
const TinySchemeView = forwardRef(View)
export default TinySchemeView
