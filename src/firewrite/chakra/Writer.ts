import ChakraWriteConsumer from './WriteConsumer'
import createWriter from '../createWriter'

const ChakraWriter = createWriter({ WriteConsumer: ChakraWriteConsumer })
export default ChakraWriter
