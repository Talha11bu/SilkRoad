import { useState, useEffect } from 'react';
import AstrolabeIcon from '../../resources/AstrolabeIcon';
import { SunIcon, MoonIcon } from '../../resources/Icons';
import { CountdownTimer } from './CountDownTimer';

interface SessionSidebarProps {
	sessionId: string;
	password: string | undefined;
	expiresAt: string | undefined;
	timeLeftStr: string | undefined;
	userCount: number;
	isHost: boolean;
	onExpire: () => void;
	onExit: () => void;
}

/** Top session navigation bar displaying session ID, access key, user count, TTL, and exit action. */
export const SessionSidebar = ({
	sessionId,
	password,
	expiresAt,
	timeLeftStr,
	userCount,
	isHost,
	onExpire,
	onExit,
}: SessionSidebarProps) => {
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		if (typeof document !== 'undefined') {
			const saved = document.documentElement.getAttribute('data-theme');
			if (saved === 'dark' || saved === 'light') return saved;
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				return 'dark';
			}
		}
		return 'light';
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	return (
		<header className='w-full border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-40'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs'>
				{/* Brand */}
				<div className='flex items-center gap-2.5'>
					<span
						className='icon-box w-7 h-7 flex items-center justify-center shrink-0'
						aria-hidden='true'
					>
						<span className='relative z-10 flex items-center justify-center'>
							<AstrolabeIcon
								size={18}
								mainColor='var(--fg)'
								accentColor='var(--accent)'
								title='Silkroad'
							/>
						</span>
					</span>
					<span className='font-bold text-sm tracking-tight text-[var(--fg)] uppercase'>
						SILK ROAD
					</span>
				</div>

				{/* Session Info Strip */}
				<div className='flex flex-wrap items-center gap-2'>
					{/* Session ID */}
					<div className='flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] bg-[var(--bg-surface)]'>
						<span className='text-[var(--fg-secondary)]'>id:</span>
						<span className='font-bold text-[var(--fg)]'>{sessionId}</span>
						<button
							type='button'
							onClick={() => copyToClipboard(sessionId, 'id')}
							className='text-[var(--accent)] hover:text-[var(--fg)] cursor-pointer bg-transparent border-0 p-0 ml-1 flex items-center'
							aria-label='Copy session ID'
							title='Copy session ID'
						>
							{copiedField === 'id' ? (
								<span className='text-[10px] font-bold'>[ok]</span>
							) : (
								<span className='text-[10px]'>[copy]</span>
							)}
						</button>
					</div>

					{/* Access Key */}
					{password && (
						<div className='flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] bg-[var(--bg-surface)]'>
							<span className='text-[var(--fg-secondary)]'>key:</span>
							<span className='font-bold text-[var(--fg)]'>{password}</span>
							<button
								type='button'
								onClick={() => copyToClipboard(password, 'pass')}
								className='text-[var(--accent)] hover:text-[var(--fg)] cursor-pointer bg-transparent border-0 p-0 ml-1 flex items-center'
								aria-label='Copy access key'
								title='Copy access key'
							>
								{copiedField === 'pass' ? (
									<span className='text-[10px] font-bold'>[ok]</span>
								) : (
									<span className='text-[10px]'>[copy]</span>
								)}
							</button>
						</div>
					)}

					{/* User Count */}
					<div
						className='flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--fg)]'
						title='Connected users in session'
					>
						<span className='text-[var(--accent)]'>users:</span>
						<span className='font-bold'>{userCount}</span>
					</div>

					{/* Countdown Timer */}
					<CountdownTimer
						expiresAt={expiresAt}
						durationStr={timeLeftStr}
						onExpire={onExpire}
					/>
				</div>

				{/* Actions: Theme + Leave/End */}
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setTheme((p) => (p === 'light' ? 'dark' : 'light'))}
						className='icon-box w-7 h-7 flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer'
						aria-label='Toggle color theme'
						title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
					>
						<span className='relative z-10 flex items-center justify-center'>
							{theme === 'light' ? (
								<MoonIcon
									size={16}
									mainColor='var(--bg-surface)'
									accentColor='var(--fg)'
								/>
							) : (
								<SunIcon
									size={16}
									mainColor='var(--bg-surface)'
									accentColor='var(--accent)'
								/>
							)}
						</span>
					</button>

					<button
						type='button'
						onClick={onExit}
						className='px-3 py-1 border border-red-600 text-red-600 font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors cursor-pointer bg-transparent'
					>
						{isHost ? '[end_session]' : '[leave]'}
					</button>
				</div>
			</div>
		</header>
	);
};
