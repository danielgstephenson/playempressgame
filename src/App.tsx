import { initializeApp } from 'firebase/app'
import { firebaseConfig, debugToken, reCaptchaSiteKey } from './secret'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import AuthProvider from './context/auth/Provider'
import DbProvider from './context/db/Provider'
import FunctionsProvider from './context/functions/Provider'
import Router from './Router'
import HeaderView from './view/Header'
import { Container } from '@chakra-ui/react'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' || // [::1] is the IPv6 localhost address.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) // 127.0.0.1/8 is considered localhost for IPv4.
)

const app = initializeApp(firebaseConfig)
// @ts-expect-error
if (isLocalhost) window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
  isTokenAutoRefreshEnabled: true
})

const db = getFirestore(app)
if (isLocalhost) connectFirestoreEmulator(db, 'localhost', 8080)
const auth = getAuth()
if (isLocalhost) connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
const functions = getFunctions(app)
if (isLocalhost) connectFunctionsEmulator(functions, 'localhost', 5001)

export default function App (): JSX.Element {
  return (
    <AuthProvider auth={auth}>
      <DbProvider db={db}>
        <FunctionsProvider functions={functions}>
          <Container
            display='flex'
            flexDirection='column'
            height='100%'
            p='5px'
          >
            <HeaderView />
            <Router />
            {/* <Box
              height='100%'
              overflowY='scroll'
            >
              <Box
                height='1000px'
                background='gray'
                display='flex'
                flexDirection='column'
                justifyContent='space-between'
              >
                <Box>start</Box>
                <Box>end</Box>
              </Box>
            </Box> */}
          </Container>
        </FunctionsProvider>
      </DbProvider>
    </AuthProvider>
  )
  // return (
  //   <>
  //     <AuthProvider auth={auth}>
  //       <DbProvider db={db}>
  //         <FunctionsProvider functions={functions}>
  //           <Container p='5px' h='99vh'>
  //             <Stack direction='column' height='100%'>
  //               <HeaderView />
  //               <Router />
  //             </Stack>
  //           </Container>
  //         </FunctionsProvider>
  //       </DbProvider>
  //     </AuthProvider>
  //   </>
  // )
}
