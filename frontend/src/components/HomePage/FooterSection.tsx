import {
	ShieldIcon,
	WarningIcon,
	LockInIcon,
	GitHubIcon,
	LinkedInIcon,
} from '../../resources/Icons';

export const FooterSection = () => {
	return (
		<>
			{/* 04. PRIVACY SECTION */}
			<section
				id='footer'
				className='max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20'
			>
				<div className='mb-8'>
					<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-2'>
						// 04. privacy &amp; terms
					</p>
					<h2 className='text-2xl sm:text-3xl font-bold text-[var(--fg)]'>
						LEGAL HANDSHAKE
					</h2>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<article className='group p-5 bg-[var(--surface)] border border-[var(--border)] flex gap-3.5 items-start'>
						<span
							className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
							aria-hidden='true'
						>
							<span className='relative z-10 flex items-center justify-center'>
								<ShieldIcon
									size={20}
									mainColor='var(--bg)'
									accentColor='var(--accent)'
								/>
							</span>
						</span>
						<div>
							<h3 className='text-sm font-bold text-[var(--fg)] uppercase mb-1.5'>
								Zero Persistence
							</h3>
							<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
								Data is piped, not stored. Once a session terminates or the
								timer hits zero, the tunnel collapses and metadata is purged.
							</p>
						</div>
					</article>

					<article className='group p-5 bg-[var(--surface)] border border-[var(--border)] flex gap-3.5 items-start'>
						<span
							className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
							aria-hidden='true'
						>
							<span className='relative z-10 flex items-center justify-center'>
								<WarningIcon
									size={20}
									mainColor='var(--bg)'
									accentColor='var(--accent)'
								/>
							</span>
						</span>
						<div>
							<h3 className='text-sm font-bold text-[var(--fg)] uppercase mb-1.5'>
								Ops-Sec Warning
							</h3>
							<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
								Do not accept session IDs from untrusted sources. Silk Road
								provides the medium; you provide the discretion.
							</p>
						</div>
					</article>

					<article className='group p-5 bg-[var(--surface)] border border-[var(--border)] flex gap-3.5 items-start'>
						<span
							className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
							aria-hidden='true'
						>
							<span className='relative z-10 flex items-center justify-center'>
								<LockInIcon
									size={20}
									mainColor='var(--bg)'
									accentColor='var(--accent)'
								/>
							</span>
						</span>
						<div>
							<h3 className='text-sm font-bold text-[var(--fg)] uppercase mb-1.5'>
								Point-to-Point
							</h3>
							<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
								Anonymous JWT sessions and direct pre-signed transfers keep
								credentials minimal and session-scoped.
							</p>
						</div>
					</article>
				</div>
			</section>

			{/* 05. MINIMAL FOOTER */}
			<footer className='bg-[var(--surface)] border-t border-[var(--border)]'>
				<div className='max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--fg-secondary)]'>
					<div className='flex items-center gap-4'>
						<span className='font-bold text-[var(--fg)]'>SILK ROAD</span>
						<span className='text-[var(--fg-muted)]'>v1.0.0</span>
						<span className='hidden sm:inline text-[var(--fg-muted)]'>
							creator // talha11bu
						</span>
					</div>

					<div className='flex flex-wrap items-center gap-4'>
						<a href='#about' className='text-[var(--fg-secondary)] hover:text-[var(--fg)] no-underline'>
							[about]
						</a>
						<a href='#features' className='text-[var(--fg-secondary)] hover:text-[var(--fg)] no-underline'>
							[features]
						</a>
						<a href='#stack' className='text-[var(--fg-secondary)] hover:text-[var(--fg)] no-underline'>
							[stack]
						</a>
						<a
							href='https://github.com/talha11bu'
							target='_blank'
							rel='noreferrer'
							className='inline-flex items-center gap-1.5 text-[var(--fg)] hover:text-[var(--accent)] no-underline'
						>
							<GitHubIcon
								size={14}
								mainColor='var(--surface)'
								accentColor='var(--fg)'
							/>
							<span>github</span>
						</a>
						<a
							href='https://linkedin.com/in/talha11bu'
							target='_blank'
							rel='noreferrer'
							className='inline-flex items-center gap-1.5 text-[var(--fg)] hover:text-[var(--accent)] no-underline'
						>
							<LinkedInIcon
								size={14}
								mainColor='var(--surface)'
								accentColor='var(--fg)'
							/>
							<span>linkedin</span>
						</a>
					</div>
				</div>
			</footer>
		</>
	);
};
