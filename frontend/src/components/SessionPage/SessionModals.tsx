import { AlertTriangle, ShieldAlert } from 'lucide-react';

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
			<div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
				<div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center space-y-6">
					<AlertTriangle className="text-red-500 mx-auto" size={48} />
					<div>
						<h2 className="text-white font-black uppercase tracking-widest text-lg">
							System Failure
						</h2>
						<p className="text-neutral-400 font-mono text-xs mt-2">
							Something went wrong establishing the session. Please verify
							your credentials and try again.
						</p>
					</div>
					<button
						onClick={onNavigateHome}
						className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xs hover:bg-white/10 transition-colors uppercase tracking-widest"
					>
						Return to Base
					</button>
				</div>
			</div>
		)}

		{/* EXPIRED MODAL */}
		{isExpiredOpen && (
			<div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
				<div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center space-y-6">
					<ShieldAlert className="text-yellow-500 mx-auto" size={48} />
					<div>
						<h2 className="text-white font-black uppercase tracking-widest text-lg">
							Session Expired
						</h2>
						<p className="text-neutral-400 font-mono text-xs mt-2">
							The Time-to-Live (TTL) for this tunnel has reached zero. All
							data has been purged.
						</p>
					</div>
					<button
						onClick={onReturnToBase}
						className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500 font-bold font-mono text-xs hover:bg-emerald-500 hover:text-black transition-colors uppercase tracking-widest"
					>
						Acknowledge & Exit
					</button>
				</div>
			</div>
		)}

		{/* EXIT CONFIRMATION MODAL */}
		{isExitOpen && (
			<div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
				<div className="bg-[var(--bg)] border border-[var(--border)] p-8 max-w-sm w-full text-center space-y-6">
					<AlertTriangle className="text-red-500 mx-auto" size={48} />
					<div>
						<h2 className="text-[var(--fg)] font-black uppercase tracking-widest text-lg">
							{isHost ? 'Terminate Session?' : 'Disconnect?'}
						</h2>
						<p className="text-[var(--fg-secondary)] font-mono text-xs mt-2 leading-relaxed">
							{isHost
								? 'WARNING: This will immediately collapse the tunnel and permanently purge all files for all connected agents.'
								: 'You are about to disconnect from the secure tunnel. You will need the Access Key to rejoin.'}
						</p>
					</div>
					<div className="flex gap-4">
						<button
							onClick={onExitCancel}
							className="flex-1 py-3 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--fg)] font-mono text-xs hover:border-[var(--fg)] transition-colors uppercase tracking-widest cursor-pointer"
						>
							Cancel
						</button>
						<button
							onClick={onExitConfirm}
							className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-bold font-mono text-xs hover:bg-red-500 hover:text-black transition-colors uppercase tracking-widest cursor-pointer"
						>
							{isHost ? 'Terminate' : 'Leave'}
						</button>
					</div>
				</div>
			</div>
		)}
	</>
);
