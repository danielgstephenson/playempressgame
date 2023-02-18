import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root')
if (container == null) throw new Error('No container with id "root" found')

const root = ReactDOM.createRoot(container)
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)
root.render(app)
