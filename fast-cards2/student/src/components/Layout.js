import './styles/Layout.css'

function Layout({ children }) {
	return (
		<div id="container">
			{children}
		</div>
	)
}

export default Layout