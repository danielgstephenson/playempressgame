import { Routes, Route } from 'react-router-dom'
import GamesView from './view/Games'
import GamePageView from './view/page/Game'
import HomePageView from './view/page/Home'

export default function Router (): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={<HomePageView />} />
      <Route path='/games' element={<GamesView />} />
      <Route path='/game/:gameId' element={<GamePageView />} />
    </Routes>
  )
}
