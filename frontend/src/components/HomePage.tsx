import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { TechStack } from './HomePage/TechStack';
import { About } from './HomePage/About';
import { Features } from './HomePage/Features';
import { FooterSection } from './HomePage/FooterSection';
import Navbar from './HomePage/NavBar';

export const HomePage = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<div className='min-h-screen bg-[var(--bg)] text-[var(--fg)]'>
			<Navbar />

			<main className='max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-10'>
				{/* Hero Section - Editorial Split Layout */}
				<section className='py-12 sm:py-16 lg:py-20 border-b border-[var(--border)]'>
					<div className='grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-8 lg:gap-12 items-end'>
						<div className='text-left'>
							<h1 className='font-display text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.02] mb-5 text-[var(--fg)]'>
								TRANSFER DATA
								<br />
								<span className='text-[var(--fg-secondary)] font-light italic'>
									WITHOUT A TRACE.
								</span>
							</h1>

							<p className='max-w-xl text-[var(--fg-secondary)] text-sm sm:text-base mb-7 leading-relaxed'>
								Silk Road creates ephemeral, password-protected sessions for
								direct file exchange. No accounts. No persistence. Pure data
								flow.
							</p>

							<div className='flex flex-wrap items-center gap-5'>
								<button
									type='button'
									onClick={() => setShowModal(true)}
									className='group px-6 py-3 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm border border-[var(--fg)] hover:bg-[var(--accent)] hover:border-[var(--accent)] cursor-pointer transition-colors inline-flex items-center gap-2'
								>
									<span>GET STARTED</span>
									<span className='inline-block transition-transform duration-200 group-hover:translate-x-1'>
										-&gt;
									</span>
								</button>
								<a
									href='#about'
									className='text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]'
								>
									read_spec
								</a>
							</div>
						</div>

						{/* Right Column: Compact System Status Panel */}
						<aside className='border border-[var(--border)] bg-[var(--surface)] p-5 text-xs'>
							<div className='flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]'>
								<span className='text-[var(--accent)] font-bold uppercase tracking-wider'>
									[ OK ] PROTOCOL ACTIVE
								</span>
								<span className='text-[var(--fg-muted)]'>v1.0.0</span>
							</div>
							<dl className='space-y-2.5'>
								<div className='flex justify-between gap-4'>
									<dt className='text-[var(--fg-muted)]'>SESSIONS</dt>
									<dd className='text-[var(--fg)] font-bold text-right'>
										EPHEMERAL / TTL-BOUND
									</dd>
								</div>
								<div className='flex justify-between gap-4'>
									<dt className='text-[var(--fg-muted)]'>IDENTITY</dt>
									<dd className='text-[var(--fg)] font-bold text-right'>
										ANONYMOUS JWT
									</dd>
								</div>
								<div className='flex justify-between gap-4'>
									<dt className='text-[var(--fg-muted)]'>TRANSFER</dt>
									<dd className='text-[var(--fg)] font-bold text-right'>
										PRE-SIGNED DIRECT URL
									</dd>
								</div>
								<div className='flex justify-between gap-4'>
									<dt className='text-[var(--fg-muted)]'>PERSISTENCE</dt>
									<dd className='text-[var(--fg)] font-bold text-right'>
										PURGED ON EXPIRY
									</dd>
								</div>
							</dl>
						</aside>
					</div>
				</section>

				<About />
				<Features />
				<TechStack />
			</main>

			<FooterSection />
			{showModal && <AuthModal onClose={() => setShowModal(false)} />}
		</div>
	);
};
