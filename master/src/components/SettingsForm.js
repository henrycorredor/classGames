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

export default function SettingsForm({ gamesList, gameInfo, setGameInfo }) {
	console.log('renderiza el form')
	function handelChange({ target }) {
		setGameInfo(val => {
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
		setGameInfo({ ...gamesList[index] })
	}

	function printInputs(settings) {
		return Object.keys(settings).map((keyName, index) => {
			const inputType = typeof settings[keyName] === 'boolean' ? 'checkbox' : 'text'

			if (inputType === 'checkbox') {
				return (
					<div key={index}>
						<label> {labels[gameInfo.id][keyName]}:
							<input
								checked={gameInfo.settings[keyName]}
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
						<label> {labels[gameInfo.id][keyName]}:
							<input
								value={gameInfo.settings[keyName]}
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
							checked={g.id === gameInfo.id}
							onChange={handleRadioChange}
						/>
					</label>
				})}
			</div>
			{printInputs(gameInfo.settings)}
		</form>
	)
}