import {
	WarningIcon,
	LockInIcon,
	AnonymityIcon,
	VelocityIcon,
	GlobeIcon,
} from '../../resources/Icons';

export const About = () => {
	return (
		<section id='about' className='py-8 border-b border-[var(--border)]'>
			<div className='mb-5'>
				<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-1'>
					// 01. the_genesis
				</p>
				<h2 className='text-2xl sm:text-3xl font-bold text-[var(--fg)] leading-tight'>
					EXISTING METHODS ARE{' '}
					<span className='text-[var(--fg-secondary)] font-normal'>
						BROKEN BY DESIGN.
					</span>
				</h2>
				<p className='text-sm text-[var(--fg-secondary)] leading-relaxed mt-2 max-w-2xl'>
					Sharing a file should not require a background check. Most platforms
					demand an <strong className='text-[var(--fg)]'>Identity Tax</strong> —
					an account, phone number, or email address just to move data from
					point A to point B.
				</p>
			</div>

			<div className='grid lg:grid-cols-2 gap-4 items-stretch'>
				{/* Left Column: Problem Cards */}
				<div className='grid gap-3'>
					<article className='group p-4 bg-[var(--bg-surface)] border border-[var(--border)] border-l-2 border-l-[var(--accent)] flex flex-col justify-center'>
						<div className='flex items-center gap-2.5 mb-1.5'>
							<span
								className='icon-box w-6 h-6 flex items-center justify-center shrink-0'
								aria-hidden='true'
							>
								<span className='relative z-10 flex items-center justify-center'>
									<WarningIcon
										size={18}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<h3 className='text-sm font-bold text-[var(--fg)] uppercase'>
								The Range &amp; Speed Trap
							</h3>
						</div>
						<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
							Bluetooth is tethered by physical distance and archaic speed caps.
							If you aren&apos;t in the same room, you&apos;re out of luck. If
							the file is large, you&apos;re waiting for hours.
						</p>
					</article>

					<article className='group p-4 bg-[var(--bg-surface)] border border-[var(--border)] border-l-2 border-l-[var(--accent)] flex flex-col justify-center'>
						<div className='flex items-center gap-2.5 mb-1.5'>
							<span
								className='icon-box w-6 h-6 flex items-center justify-center shrink-0'
								aria-hidden='true'
							>
								<span className='relative z-10 flex items-center justify-center'>
									<LockInIcon
										size={18}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<h3 className='text-sm font-bold text-[var(--fg)] uppercase'>
								The Identity Lock-in
							</h3>
						</div>
						<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
							Email, messaging apps, and cloud drives require you to be
							&quot;known&quot; to the platform. To share, you must expose your
							profile. Silk Road deletes the middleman.
						</p>
					</article>
				</div>

				{/* Right Column: The Silk Road Solution */}
				<aside className='p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex flex-col justify-between'>
					<h3 className='text-sm font-bold text-[var(--accent)] uppercase tracking-wider pb-2.5 mb-3 border-b border-[var(--border)]'>
						The Silk Road Way
					</h3>

					<ol className='space-y-3 my-auto'>
						<li className='group flex gap-3'>
							<span className='icon-box w-7 h-7 flex items-center justify-center shrink-0'>
								<span className='relative z-10 flex items-center justify-center'>
									<AnonymityIcon
										size={20}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h4 className='text-sm font-bold text-[var(--fg)]'>
									TOTAL ANONYMITY
								</h4>
								<p className='text-xs text-[var(--fg-secondary)] mt-0.5 leading-relaxed'>
									No accounts. No identities. Just a session ID and a handshake.
								</p>
							</div>
						</li>
						<li className='group flex gap-3'>
							<span className='icon-box w-7 h-7 flex items-center justify-center shrink-0'>
								<span className='relative z-10 flex items-center justify-center'>
									<VelocityIcon
										size={20}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h4 className='text-sm font-bold text-[var(--fg)]'>
									UNBOUND VELOCITY
								</h4>
								<p className='text-xs text-[var(--fg-secondary)] mt-0.5 leading-relaxed'>
									We don&apos;t throttle. Your transfer speed is limited only by
									your ISP and connectivity.
								</p>
							</div>
						</li>
						<li className='group flex gap-3'>
							<span className='icon-box w-7 h-7 flex items-center justify-center shrink-0'>
								<span className='relative z-10 flex items-center justify-center'>
									<GlobeIcon
										size={20}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h4 className='text-sm font-bold text-[var(--fg)]'>
									GLOBAL REACH
								</h4>
								<p className='text-xs text-[var(--fg-secondary)] mt-0.5 leading-relaxed'>
									Share with someone across the room or across the planet with
									zero friction.
								</p>
							</div>
						</li>
					</ol>
				</aside>
			</div>
		</section>
	);
};
