import { useState, useEffect } from 'react'

const PREFIX = 'cg-fast-cards-'

export default function useLocalStorage(key, inivialValue) {
	const prefixedKey = PREFIX + key
	const [value, setValue] = useState(() => {
		const jsonValue = localStorage.getItem(prefixedKey)
		if (jsonValue !== null) return JSON.parse(jsonValue)
		return inivialValue
	})

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value))
	}, [prefixedKey, value])

	return [value, setValue]
}