import { WarningIcon, ShieldIcon } from '../../resources/Icons';

interface SessionModalsProps {
	isErrorOpen: boolean;
	isExpiredOpen: boolean;
	isExitOpen: boolean;
	isHost: boolean;
	onNavigateHome: () => void;
	onReturnToBase: () => void;
	onExitConfirm: () => void;
	onExitCancel: () => void;
}

/** Renders all session-level modals: error, expired, and exit confirmation. */
export const SessionModals = ({
	isErrorOpen,
	isExpiredOpen,
	isExitOpen,
	isHost,
	onNavigateHome,
	onReturnToBase,
	onExitConfirm,
	onExitCancel,
}: SessionModalsProps) => (
	<>
		{/* ERROR MODAL */}
		{isErrorOpen && (
			<div className='min-h-screen bg-[var(--bg)] flex items-center justify-center p-4'>
				<div className='bg-[var(--bg-surface)] border border-[var(--border)] p-8 max-w-sm w-full text-center space-y-5'>
					<WarningIcon
						className='mx-auto'
						size={40}
						mainColor='var(--bg-surface)'
						accentColor='#dc2626'
					/>
					<div>
						<h2 className='text-[var(--fg)] font-bold uppercase tracking-wider text-base'>
							System Failure
						</h2>
						<p className='text-[var(--fg-secondary)] text-xs mt-2 leading-relaxed'>
							Something went wrong establishing the session. Please verify
							your credentials and try again.
						</p>
					</div>
					<button
						type='button'
						onClick={onNavigateHome}
						className='w-full py-2.5 bg-[var(--fg)] text-[var(--bg)] border border-[var(--fg)] text-xs font-bold hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-colors uppercase tracking-wider cursor-pointer'
					>
						Return to Base
					</button>
				</div>
			</div>
		)}

		{/* EXPIRED MODAL */}
		{isExpiredOpen && (
			<div className='min-h-screen bg-[var(--bg)] flex items-center justify-center p-4'>
				<div className='bg-[var(--bg-surface)] border border-[var(--border)] p-8 max-w-sm w-full text-center space-y-5'>
					<ShieldIcon
						className='mx-auto'
						size={40}
						mainColor='var(--bg-surface)'
						accentColor='var(--accent)'
					/>
					<div>
						<h2 className='text-[var(--fg)] font-bold uppercase tracking-wider text-base'>
							Session Expired
						</h2>
						<p className='text-[var(--fg-secondary)] text-xs mt-2 leading-relaxed'>
							The Time-to-Live (TTL) for this tunnel has reached zero. All data
							has been purged.
						</p>
					</div>
					<button
						type='button'
						onClick={onReturnToBase}
						className='w-full py-2.5 bg-[var(--fg)] text-[var(--bg)] border border-[var(--fg)] text-xs font-bold hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-colors uppercase tracking-wider cursor-pointer'
					>
						Acknowledge &amp; Exit
					</button>
				</div>
			</div>
		)}

		{/* EXIT CONFIRMATION MODAL */}
		{isExitOpen && (
			<div className='fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4'>
				<div className='bg-[var(--bg)] border border-[var(--fg)] p-6 max-w-sm w-full text-center space-y-5'>
					<WarningIcon
						className='mx-auto'
						size={36}
						mainColor='var(--bg)'
						accentColor='#dc2626'
					/>
					<div>
						<h2 className='text-[var(--fg)] font-bold uppercase tracking-wider text-base'>
							{isHost ? 'Terminate Session?' : 'Disconnect?'}
						</h2>
						<p className='text-[var(--fg-secondary)] text-xs mt-2 leading-relaxed'>
							{isHost
								? 'WARNING: This will immediately collapse the tunnel and permanently purge all files for all connected users.'
								: 'You are about to disconnect from the secure tunnel. You will need the Access Key to rejoin.'}
						</p>
					</div>
					<div className='flex gap-3'>
						<button
							type='button'
							onClick={onExitCancel}
							className='flex-1 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--fg)] text-xs hover:border-[var(--fg)] transition-colors uppercase tracking-wider cursor-pointer'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={onExitConfirm}
							className='flex-1 py-2.5 bg-red-600 text-white border border-red-600 font-bold text-xs hover:bg-red-700 transition-colors uppercase tracking-wider cursor-pointer'
						>
							{isHost ? 'Terminate' : 'Leave'}
						</button>
					</div>
				</div>
			</div>
		)}
	</>
);
