import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'

const container = document.getElementById('root')
if (container == null) throw new Error('No container with id "root" found')

const root = ReactDOM.createRoot(container)
const app = (
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
root.render(app)
