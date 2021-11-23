import React from "react"
import { GameSessionProvider } from "../contexts/SessionProvider"
import SettingsProvider from "../contexts/SettingsProvider"
import { SocketProvider } from "../contexts/SocketProvider"
import GameBoard from "./GameBoard"

function App() {
  return (
    <SettingsProvider>
      <GameSessionProvider>
        <SocketProvider>
          <GameBoard />
        </SocketProvider>
      </GameSessionProvider>
    </SettingsProvider>
  )
}

export default App
