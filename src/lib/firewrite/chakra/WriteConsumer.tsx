import ChakraButton from './Button'
import createWriteConsumer from '../createWriteConsumer'
import { ButtonProps } from '@chakra-ui/react'

const ChakraWriteConsumer = createWriteConsumer<ButtonProps>({ WriterView: ChakraButton })
export default ChakraWriteConsumer
