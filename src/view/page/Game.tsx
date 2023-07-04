import { useParams } from 'react-router-dom'
import GameView from '../Game'

export default function GamePageView (): JSX.Element {
  const params = useParams()
  if (params.gameId == null) return <></>
  return (
    <div style={{
      padding: '10px',
      boxSizing: 'border-box',
      background: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    >
      <div>
        <div style={{
          background: 'green',
          height: '200px'
        }}
        >a
        </div>
      </div>
      <div>
        <div style={{
          height: '100px',
          background: 'blue'
        }}
        >b
        </div>
      </div>
      <div style={{
        background: 'purple',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'scroll'
      }}
      >
        <div style={{
          height: '1000px',
          background: 'gray',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        >
          <div>start</div>
          <div>end</div>
        </div>
      </div>
    </div>
  )
  // return <GameView gameId={params.gameId} />
}
