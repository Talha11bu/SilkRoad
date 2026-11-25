import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { SessionPage } from './components/SessionPage';

export default function App() {
	return (
		<BrowserRouter>
			<div className='min-h-screen bg-[var(--bg)] text-[var(--fg)]'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/session' element={<SessionPage />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
