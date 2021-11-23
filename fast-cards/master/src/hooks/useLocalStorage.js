import { useEffect, useState } from 'react'

const PREFIX = 'cg-fast-cards-master-'

export default function useLocalStorage(key, initialValue) {
	const prefixedKey = PREFIX + key
	const [value, setValue] = useState(() => {
		const storedValued = localStorage.getItem(prefixedKey)
		return (storedValued) ? JSON.parse(storedValued) : initialValue
	})

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value))
	}, [prefixedKey, value])

	return [value, setValue]
}