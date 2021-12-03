import '../../node_modules/reseter.css/css/reseter.min.css'
import './styles/Layout.css'

export default function Layout({ children }) {
	return (
		<div className='container'>
			{children}
		</div>
	)
}