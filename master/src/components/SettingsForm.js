const labels = {
	fastCards: {
		needTeacher: 'Tomar turnos para ser profesor',
		numberOfCardsOnBoard: 'Número de cartas',
		maxPoints: 'Puntos para ganar',
		showStudentsName: 'Mostrar nombres',
		showStudentChoises: 'Mostrar si la selección es correcta o no',
		showWhoIsFirst: 'Mostrar el primero de cada turno'
	},
	test: {
		needTeacher: 'Probando'
	}
}

export default function SettingsForm({ gamesList, gameOptions, setGameOptions }) {
	console.log('renderiza el form')
	function handelChange({ target }) {
		setGameOptions(val => {
			return {
				...val,
				settings: {
					...val.settings,
					[target.name]: target.type === 'checkbox' ? target.checked : target.value
				}
			}
		})
	}

	function handleRadioChange({ target }) {
		console.log('miau', target)
		const index = gamesList.findIndex(g => g.id === target.value)
		setGameOptions({ ...gamesList[index] })
	}

	function printInputs(settings) {
		return Object.keys(settings).map((keyName, index) => {
			const inputType = typeof settings[keyName] === 'boolean' ? 'checkbox' : 'text'

			if (inputType === 'checkbox') {
				return (
					<div key={index}>
						<label> {labels[gameOptions.id][keyName]}:
							<input
								checked={gameOptions.settings[keyName]}
								onChange={handelChange}
								type={inputType}
								name={keyName}
							/>
						</label>
					</div>
				)
			} else {
				return (
					<div key={index}>
						<label> {labels[gameOptions.id][keyName]}:
							<input
								value={gameOptions.settings[keyName]}
								onChange={handelChange}
								type={inputType}
								name={keyName}
							/>
						</label>
					</div>
				)
			}
		})
	}

	return (
		<form className='settings-form'>
			<div className='games-list'>
				{gamesList.map(g => {
					return <label key={g.id}>
						{g.name}:
						<input
							key={g.id}
							type="radio"
							name='game'
							value={g.id}
							checked={g.id === gameOptions.id}
							onChange={handleRadioChange}
						/>
					</label>
				})}
			</div>
			{printInputs(gameOptions.settings)}
		</form>
	)
}