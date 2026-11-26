import { ShieldIcon, TimerIcon, ZapIcon } from '../../resources/Icons';

export const Features = () => {
	const items = [
		{
			key: 'E2E',
			tag: '[E2E]',
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
			tag: '[TTL]',
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
			tag: '[STREAM]',
			icon: (
				<ZapIcon
					size={24}
					mainColor='var(--bg)'
					accentColor='var(--accent)'
					title='Stream Only'
				/>
			),
			title: 'Stream Only',
			desc: 'Data flows directly via pre-signed URLs without server disk staging.',
		},
	];

	return (
		<section
			id='features'
			className='py-14 lg:py-20 border-b border-[var(--border)]'
		>
			<div className='mb-8'>
				<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-2'>
					// 02. capabilities
				</p>
				<h2 className='text-2xl sm:text-3xl font-bold text-[var(--fg)]'>
					Engineered for Stealth
				</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
				{items.map((item) => (
					<article
						key={item.key}
						className='group p-5 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex flex-col justify-between'
					>
						<div>
							<div className='flex items-center justify-between mb-4'>
								<div
									className='icon-box w-8 h-8 flex items-center justify-center'
									aria-hidden='true'
								>
									<span className='relative z-10 flex items-center justify-center'>
										{item.icon}
									</span>
								</div>
								<span className='text-[11px] text-[var(--fg-muted)]'>
									{item.tag}
								</span>
							</div>
							<h3 className='text-base font-bold text-[var(--fg)] mb-2'>
								{item.title}
							</h3>
							<p className='text-xs sm:text-sm text-[var(--fg-secondary)] leading-relaxed'>
								{item.desc}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};
