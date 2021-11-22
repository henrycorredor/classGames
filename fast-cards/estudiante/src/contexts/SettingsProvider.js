import React, { createContext, useContext } from 'react'

const SettingsContext = createContext()

export function useSettings() {
	useContext(SettingsContext)
}

export default function SettingsProvider({ children }) {
	const settings = {}
	return (
		<SettingsContext.Provider value={settings}>
			{children}
		</SettingsContext.Provider>
	)
}
