import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession, joinSession } from '../api/sessionApi';
import type { SessionData, SessionResponse } from '../types';

export const AuthModal = ({ onClose }: { onClose: () => void }) => {
	const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
	const [duration, setDuration] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingText, setLoadingText] = useState('ESTABLISHING TUNNEL...');
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		setLoadingText('NEGOTIATING UPLINK...');

		const formData = new FormData(e.currentTarget);
		const inputData = Object.fromEntries(formData.entries());

		try {
			let response: SessionResponse;

			if (activeTab === 'create') {
				response = await createSession(
					inputData.password as string,
					parseInt(inputData.duration as string, 10)
				);
			} else {
				response = await joinSession(
					inputData.sessionId as string,
					inputData.password as string
				);
			}

			if (!response.token) {
				throw new Error('Authentication token missing from server response.');
			}

			localStorage.setItem('silk_road_jwt', response.token);

			const sessionData: SessionData = response;

			onClose();
			navigate('/session', { state: { sessionData } });
		} catch (err: unknown) {
			console.error('Auth Error:', err);
			const errMsg =
				err instanceof Error ? err.message : 'CONNECTION REFUSED BY HOST';
			setError(errMsg);
			localStorage.removeItem('silk_road_jwt');
		} finally {
			setIsLoading(false);
		}
	};

	const ttlOptions = [5, 10, 15, 30, 60];

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
			<div className='relative bg-[var(--bg)] border border-[var(--fg)] w-full max-w-lg p-6'>
				{isLoading && (
					<div className='absolute inset-0 z-50 bg-[var(--bg)]/95 flex flex-col items-center justify-center p-6 text-center'>
						<p className='text-sm text-[var(--accent)] font-bold tracking-wider uppercase'>
							{loadingText}
						</p>
						<p className='text-xs text-[var(--fg-secondary)] mt-2'>
							please wait...
						</p>
					</div>
				)}

				<div className='flex items-center justify-between border-b border-[var(--border)] pb-3 mb-5'>
					<span className='text-sm font-bold text-[var(--fg)]'>
						session_auth
					</span>
					<button
						type='button'
						onClick={onClose}
						className='text-xs text-[var(--fg-secondary)] hover:text-[var(--fg)] bg-transparent border-0 cursor-pointer'
					>
						[close]
					</button>
				</div>

				{/* Tab Navigation */}
				<div className='flex border border-[var(--border)] mb-5'>
					<button
						type='button'
						onClick={() => {
							setActiveTab('create');
							setError(null);
						}}
						className={`flex-1 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors ${
							activeTab === 'create'
								? 'bg-[var(--fg)] text-[var(--bg)] font-bold'
								: 'bg-transparent text-[var(--fg-secondary)] hover:text-[var(--fg)]'
						}`}
					>
						create_session
					</button>
					<button
						type='button'
						onClick={() => {
							setActiveTab('join');
							setError(null);
						}}
						className={`flex-1 py-2 text-xs uppercase tracking-wider cursor-pointer border-l border-[var(--border)] transition-colors ${
							activeTab === 'join'
								? 'bg-[var(--fg)] text-[var(--bg)] font-bold'
								: 'bg-transparent text-[var(--fg-secondary)] hover:text-[var(--fg)]'
						}`}
					>
						join_session
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{activeTab === 'create' && (
						<div>
							<input type='hidden' name='duration' value={duration} />
							<label className='block text-xs text-[var(--fg-secondary)] mb-1.5'>
								ttl (minutes):
							</label>
							<div className='flex border border-[var(--border)]'>
								{ttlOptions.map((opt, idx) => (
									<button
										key={opt}
										type='button'
										onClick={() => setDuration(opt)}
										className={`flex-1 py-1.5 text-xs cursor-pointer ${
											idx > 0 ? 'border-l border-[var(--border)]' : ''
										} ${
											duration === opt
												? 'bg-[var(--accent)] text-[var(--bg)] font-bold'
												: 'bg-transparent text-[var(--fg-secondary)] hover:text-[var(--fg)]'
										}`}
									>
										{opt}m
									</button>
								))}
							</div>
						</div>
					)}

					{activeTab === 'join' && (
						<div>
							<label className='block text-xs text-[var(--fg-secondary)] mb-1'>
								session_id:
							</label>
							<input
								type='text'
								name='sessionId'
								placeholder='enter session id'
								required
								className='w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] outline-none placeholder:text-[var(--fg-secondary)]'
							/>
						</div>
					)}

					<div>
						<label className='block text-xs text-[var(--fg-secondary)] mb-1'>
							password:
						</label>
						<input
							type='password'
							name='password'
							placeholder='enter password'
							required
							className='w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] outline-none placeholder:text-[var(--fg-secondary)]'
						/>
					</div>

					{error && (
						<div className='p-2.5 border border-red-600 text-red-600 text-xs'>
							error: {error}
						</div>
					)}

					<div className='flex gap-3 pt-2'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 px-4 py-2.5 border border-[var(--border)] text-[var(--fg)] text-xs uppercase tracking-wider hover:border-[var(--fg)] cursor-pointer bg-transparent'
						>
							cancel
						</button>
						<button
							type='submit'
							className='flex-1 px-4 py-2.5 bg-[var(--fg)] text-[var(--bg)] border border-[var(--fg)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:border-[var(--accent)] cursor-pointer'
						>
							{activeTab === 'create' ? 'execute' : 'enter'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
