import {
	ShieldIcon,
	WarningIcon,
	LockInIcon,
	GitHubIcon,
	LinkedInIcon,
} from '../../resources/Icons';

export const FooterSection = () => {
	return (
		<footer
			id='footer'
			className='bg-[var(--bg-surface)] text-[var(--fg)] border-t-2 border-[var(--accent)] mt-4'
		>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>
				<div className='mb-5'>
					<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-1'>
						// 04. legal_handshake
					</p>
					<h2 className='text-2xl font-bold text-[var(--fg)]'>
						PRIVACY &amp; TERMS
					</h2>
				</div>

				<div className='grid lg:grid-cols-2 gap-4 items-stretch'>
					{/* LEFT: Privacy & Security */}
					<div className='grid gap-3'>
						<article className='group p-3 border border-[var(--border)] bg-[var(--bg)] flex gap-3'>
							<span
								className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
								aria-hidden='true'
							>
								<span className='relative z-10 flex items-center justify-center'>
									<ShieldIcon
										size={20}
										mainColor='var(--bg-surface)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h3 className='text-xs font-bold text-[var(--fg)] uppercase mb-1'>
									Zero Persistence
								</h3>
								<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
									Data is piped, not stored. Once a session terminates or the
									timer hits zero, the tunnel collapses and all metadata is
									purged.
								</p>
							</div>
						</article>

						<article className='group p-3 border border-[var(--border)] bg-[var(--bg)] flex gap-3'>
							<span
								className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
								aria-hidden='true'
							>
								<span className='relative z-10 flex items-center justify-center'>
									<WarningIcon
										size={20}
										mainColor='var(--bg-surface)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h3 className='text-xs font-bold text-[var(--fg)] uppercase mb-1'>
									Ops-Sec Warning
								</h3>
								<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
									Do not accept session IDs from untrusted sources. Silk Road
									provides the medium; you provide the discretion.
								</p>
							</div>
						</article>

						<article className='group p-3 border border-[var(--border)] bg-[var(--bg)] flex gap-3'>
							<span
								className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
								aria-hidden='true'
							>
								<span className='relative z-10 flex items-center justify-center'>
									<LockInIcon
										size={20}
										mainColor='var(--bg-surface)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h3 className='text-xs font-bold text-[var(--fg)] uppercase mb-1'>
									Point-to-Point
								</h3>
								<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
									Encrypted handshakes ensure that even we cannot see what flows
									through the Silk Road.
								</p>
							</div>
						</article>
					</div>

					{/* RIGHT: Creator Box */}
					<aside className='p-4 sm:p-5 border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between space-y-4'>
						<div>
							<div className='flex items-center justify-between border-b border-[var(--border)] pb-2.5 mb-3'>
								<span className='text-xs text-[var(--accent)] uppercase tracking-wider font-bold'>
									creator // talha11bu
								</span>
								<span className='text-xs text-[var(--fg-secondary)]'>
									v1.0.0
								</span>
							</div>

							<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
								Built for fast, ephemeral, zero-log file exchange. Designed with
								minimalist terminal-inspired aesthetics and sharp geometry.
							</p>
						</div>

						<div className='flex flex-wrap gap-3 pt-3 border-t border-[var(--border)] text-xs'>
							<a
								href='https://github.com/talha11bu'
								target='_blank'
								rel='noreferrer'
								className='border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-[var(--fg)] hover:border-[var(--accent)] no-underline transition-colors inline-flex items-center gap-1.5'
							>
								<GitHubIcon
									size={14}
									mainColor='var(--bg-surface)'
									accentColor='var(--fg)'
								/>
								<span>github</span>
							</a>
							<a
								href='https://linkedin.com/in/talha11bu'
								target='_blank'
								rel='noreferrer'
								className='border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-[var(--fg)] hover:border-[var(--accent)] no-underline transition-colors inline-flex items-center gap-1.5'
							>
								<LinkedInIcon
									size={14}
									mainColor='var(--bg-surface)'
									accentColor='var(--fg)'
								/>
								<span>linkedin</span>
							</a>
						</div>
					</aside>
				</div>

				<div className='mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap justify-between items-center gap-2 text-xs text-[var(--fg-secondary)]'>
					<span>silkroad // ephemeral file exchange</span>
					<span>protocol v1.0.0</span>
				</div>
			</div>
		</footer>
	);
};
