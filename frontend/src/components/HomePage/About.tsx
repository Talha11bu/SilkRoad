import {
	WarningIcon,
	LockInIcon,
	AnonymityIcon,
	VelocityIcon,
	GlobeIcon,
} from '../../resources/Icons';

export const About = () => {
	return (
		<section id='about' className='py-14 lg:py-20 border-b border-[var(--border)]'>
			<div className='mb-8'>
				<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-2'>
					// 01. the_genesis
				</p>
				<h2 className='text-2xl sm:text-3xl font-bold text-[var(--fg)] leading-tight'>
					EXISTING METHODS ARE{' '}
					<span className='text-[var(--fg-secondary)] font-normal'>
						BROKEN BY DESIGN.
					</span>
				</h2>
				<p className='text-sm sm:text-base text-[var(--fg-secondary)] leading-relaxed mt-3 max-w-2xl'>
					Sharing a file should not require a background check. Most platforms
					demand an <strong className='text-[var(--fg)]'>Identity Tax</strong> —
					an account, phone number, or email address just to move data from
					point A to point B.
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
				{/* Left Column: Conventional Problems */}
				<div className='bg-[var(--surface)] border border-[var(--border)] flex flex-col'>
					<div className='px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between'>
						<span className='text-xs font-bold uppercase tracking-wider text-[var(--fg-secondary)]'>
							[ ! ] CONVENTIONAL
						</span>
						<span className='text-[11px] text-[var(--fg-muted)]'>
							LEGACY FLOWS
						</span>
					</div>

					<div className='divide-y divide-[var(--border)] flex-1 flex flex-col justify-between'>
						<article className='group p-5 flex gap-3.5 items-start'>
							<span
								className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
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
							<div>
								<h3 className='text-sm font-bold text-[var(--fg)] uppercase mb-1'>
									The Range &amp; Speed Trap
								</h3>
								<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
									Bluetooth is tethered by physical distance and archaic speed
									caps. If you aren&apos;t in the same room, you&apos;re out of
									luck. If the file is large, you&apos;re waiting for hours.
								</p>
							</div>
						</article>

						<article className='group p-5 flex gap-3.5 items-start'>
							<span
								className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'
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
							<div>
								<h3 className='text-sm font-bold text-[var(--fg)] uppercase mb-1'>
									The Identity Lock-in
								</h3>
								<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
									Email, messaging apps, and cloud drives require you to be
									&quot;known&quot; to the platform. To share, you must expose
									your profile. Silk Road deletes the middleman.
								</p>
							</div>
						</article>
					</div>
				</div>

				{/* Right Column: The Silk Road Way */}
				<aside className='bg-[var(--surface)] border border-[var(--border)] flex flex-col'>
					<div className='px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between'>
						<span className='text-xs font-bold uppercase tracking-wider text-[var(--accent)]'>
							[ + ] THE SILK ROAD WAY
						</span>
						<span className='text-[11px] text-[var(--fg-muted)]'>
							EPHEMERAL FLOW
						</span>
					</div>

					<ol className='divide-y divide-[var(--border)] flex-1 flex flex-col justify-between'>
						<li className='group p-5 flex gap-3.5 items-start'>
							<span className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'>
								<span className='relative z-10 flex items-center justify-center'>
									<AnonymityIcon
										size={20}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h4 className='text-sm font-bold text-[var(--fg)] uppercase mb-1'>
									Total Anonymity
								</h4>
								<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
									No accounts. No identities. Just a session ID and a handshake.
								</p>
							</div>
						</li>
						<li className='group p-5 flex gap-3.5 items-start'>
							<span className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'>
								<span className='relative z-10 flex items-center justify-center'>
									<VelocityIcon
										size={20}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h4 className='text-sm font-bold text-[var(--fg)] uppercase mb-1'>
									Unbound Velocity
								</h4>
								<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
									We don&apos;t throttle. Your transfer speed is limited only by
									your ISP and connectivity.
								</p>
							</div>
						</li>
						<li className='group p-5 flex gap-3.5 items-start'>
							<span className='icon-box w-7 h-7 flex items-center justify-center shrink-0 mt-0.5'>
								<span className='relative z-10 flex items-center justify-center'>
									<GlobeIcon
										size={20}
										mainColor='var(--bg)'
										accentColor='var(--accent)'
									/>
								</span>
							</span>
							<div>
								<h4 className='text-sm font-bold text-[var(--fg)] uppercase mb-1'>
									Global Reach
								</h4>
								<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
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
