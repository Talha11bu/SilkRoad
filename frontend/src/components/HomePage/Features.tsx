import { ShieldIcon, TimerIcon, ZapIcon } from '../../resources/Icons';

export const Features = () => {
	const items = [
		{
			key: 'E2E',
			icon: (
				<ShieldIcon
					size={24}
					mainColor='var(--bg)'
					accentColor='var(--accent)'
					title='End-to-End'
				/>
			),
			title: 'End-to-End',
			desc: 'Your files are encrypted before they even leave your browser.',
		},
		{
			key: 'TTL',
			icon: (
				<TimerIcon
					size={24}
					mainColor='var(--bg)'
					accentColor='var(--accent)'
					title='Self-Destruct'
				/>
			),
			title: 'Self-Destruct',
			desc: 'Links expire automatically after a set time or single download.',
		},
		{
			key: 'MEM',
			icon: (
				<ZapIcon
					size={24}
					mainColor='var(--bg)'
					accentColor='var(--accent)'
					title='Stream Only'
				/>
			),
			title: 'Stream Only',
			desc: 'Data flows through the server memory — never the hard drive.',
		},
	];

	return (
		<section id='features' className='py-8 border-b border-[var(--border)]'>
			<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-1.5'>
				// 02. capabilities
			</p>
			<h2 className='text-2xl font-bold text-[var(--fg)] mb-5'>
				Engineered for Stealth
			</h2>

			<div className='grid sm:grid-cols-3 gap-4'>
				{items.map((item) => (
					<article
						key={item.key}
						className='group p-4 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors'
					>
						<div
							className='icon-box w-8 h-8 flex items-center justify-center mb-3'
							aria-hidden='true'
						>
							<span className='relative z-10 flex items-center justify-center'>
								{item.icon}
							</span>
						</div>
						<h3 className='text-sm font-bold text-[var(--fg)] mb-1.5'>
							{item.title}
						</h3>
						<p className='text-xs text-[var(--fg-secondary)] leading-relaxed'>
							{item.desc}
						</p>
					</article>
				))}
			</div>
		</section>
	);
};
