import { useEffect, useState } from "react"

const PREFIX = 'cg-master-fast-card-'

export default function useLocalStorage(key, initialValue) {
	const prefixedKey = PREFIX + key

	const [value, setValue] = useState(() => {
		const savedValue = localStorage.getItem(prefixedKey)
		return (savedValue) ? JSON.parse(savedValue) : initialValue
	})

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value))
	}, [value, prefixedKey])

	return [value, setValue]
}