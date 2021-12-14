import { useState, useEffect } from 'react'

const PREFIX = 'cg-student-fast-card-'

export default function useLocalStorage(key, initialValue) {
	const prefixedKey = PREFIX + key
	const [value, setValue] = useState(() => {
		const storedValue = localStorage.getItem(prefixedKey)
		return (storedValue) ? JSON.parse(storedValue) : initialValue
	})

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value))
	}, [value, prefixedKey])

	return [value, setValue]
}