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

			<main className='max-w-4xl mx-auto px-4 sm:px-6'>
				{/* Hero Section - Left Aligned, Compact */}
				<section className='py-10 sm:py-14 border-b border-[var(--border)] text-left'>
					<h1 className='text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4 text-[var(--fg)]'>
						TRANSFER DATA
						<br />
						<span className='text-[var(--fg-secondary)] font-normal'>
							WITHOUT A TRACE.
						</span>
					</h1>

					<p className='max-w-xl text-[var(--fg-secondary)] text-sm sm:text-base mb-6 leading-relaxed'>
						Silk Road creates ephemeral, encrypted tunnels for file exchange.
						No storage logs. No persistence. Pure data flow.
					</p>

					<div className='flex flex-wrap items-center gap-4'>
						<button
							type='button'
							onClick={() => setShowModal(true)}
							className='group px-5 py-2.5 bg-[var(--fg)] text-[var(--bg)] font-bold text-sm border border-[var(--fg)] hover:bg-[var(--accent)] hover:border-[var(--accent)] cursor-pointer transition-colors inline-flex items-center gap-2'
						>
							<span>GET STARTED</span>
							<span className='inline-block transition-transform duration-200 group-hover:translate-x-1'>
								-&gt;
							</span>
						</button>
						<a
							href='#about'
							className='text-sm text-[var(--fg-secondary)] hover:text-[var(--fg)]'
						>
							read_spec
						</a>
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
