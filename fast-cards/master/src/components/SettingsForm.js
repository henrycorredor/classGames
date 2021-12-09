export default function SettingsForm({ form, setForm }) {
	function handelChange({ target }) {
		setForm(val => {
			return {
				...val,
				[target.name]: target.type === 'checkbox' ? target.checked : target.value
			}
		})
	}

	return (
		<form className='settings-form'>
			<div>
				<label>Número de cartas:
					<input onChange={handelChange} type="text" name="numberOfCardsOnBoard" value={form.numberOfCardsOnBoard} />
				</label>
			</div>
			<div>
				<label>Puntos para ganar:
					<input onChange={handelChange} type="text" name="maxPoints" value={form.maxPoints} />
				</label>
			</div>
			<div>
				<label>Mostrar nombres:
					<input onChange={handelChange} type="checkbox" name="showStudentsName" checked={form.showStudentsName} />
				</label>
			</div>
			<div>
				<label>Mostrar si la selección es correcta o no:
					<input onChange={handelChange} type="checkbox" name='showStudentChoises' checked={form.showStudentChoises} />
				</label>
			</div>
			<div>
				<label>Tomar turnos para ser profesor
					<input onChange={handelChange} type="checkbox" name='teachersTakeTurns' checked={form.teachersTakeTurns} />
				</label>
			</div>
			<div>
				<label>Mostrar el primero de cada turno
					<input onChange={handelChange} type="checkbox" name='showWhoIsFirst' checked={form.showWhoIsFirst} />
				</label>
			</div>
			{/* <div>
					<label>Límite de tiempo
						<input onChange={handelChange} type="text" name='timeLimit' vale={form.timeLimit} />
					</label>
				</div> */}
		</form>
	)
}