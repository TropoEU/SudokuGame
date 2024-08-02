import './App.css';
import { Board } from './Components/Board';
import React from 'react';
import GoogleSignIn from './Components/GoogleSignIn';

function App() {
	return (
		<div className='App'>
			<header className='App-header'>
				<GoogleSignIn />
				<br />
				<Board />
			</header>
		</div>
	);
}

export default App;
