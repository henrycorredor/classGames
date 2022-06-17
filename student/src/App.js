import './App.css';
//import GameBoard from './components/GameBoard'
//import { SessionProvider } from './contexts/SessionProvider'
//import { SocketProvider } from './contexts/SocketProvider'

function Orale({ children }) {
  console.log('orale')
  return <div>Holi - {children}</div>
}

export default function App() {
  console.log('App una vez')
  return (
    <Orale> Lala </Orale>
  )
}