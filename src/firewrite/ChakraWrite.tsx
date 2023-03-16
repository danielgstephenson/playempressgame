import ChakraAction from './ChakraAction'
import createWrite from './createWriteView'

const ChakraWrite = createWrite({ WriteView: ChakraAction })
export default ChakraWrite
