import React from "react"
import { GameSessionProvider } from "../contexts/SessionProvider"
import SettingsProvider from "../contexts/SettingsProvider"
import { SocketProvider } from "../contexts/SocketProvider"
import GameBoard from "./GameBoard"

function App() {
  return (
    <SettingsProvider>
      <SocketProvider>
        <GameSessionProvider>
          <GameBoard />
        </GameSessionProvider>
      </SocketProvider>
    </SettingsProvider>
  )
}

export default App
