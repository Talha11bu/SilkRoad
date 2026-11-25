import {
	SpringBootIcon,
	BunIcon,
	React19Icon,
	CloudflareIcon,
} from '../../resources/Icons';

const STACK_DATA = [
	{
		icon: (
			<SpringBootIcon
				size={20}
				mainColor='var(--bg)'
				accentColor='var(--accent)'
				title='Spring Boot 3'
			/>
		),
		name: 'Spring Boot 3',
		role: 'Core Infrastructure',
		desc: 'Enterprise-level safety and horizontal scalability. Repurposed for modern ephemeral data handling.',
		url: 'https://spring.io',
	},
	{
		icon: (
			<BunIcon
				size={20}
				mainColor='var(--accent)'
				accentColor='var(--bg)'
				title='Bun Runtime'
			/>
		),
		name: 'Bun Runtime',
		role: 'High-Speed I/O',
		desc: 'A modern JavaScript runtime built for speed. Handling session logic with sub-millisecond response times.',
		url: 'https://bun.sh',
	},
	{
		icon: (
			<React19Icon
				size={20}
				mainColor='var(--accent)'
				accentColor='var(--bg)'
				title='React 19 & Vite'
			/>
		),
		name: 'React 19 & Vite',
		role: 'Interface Engine',
		desc: 'Hyper-responsive UI architecture that maintains fluidity even during heavy file streaming operations.',
		url: 'https://vite.dev',
	},
	{
		icon: (
			<CloudflareIcon
				size={20}
				mainColor='var(--bg)'
				accentColor='var(--accent)'
				title='Cloudflare R2'
			/>
		),
		name: 'Cloudflare R2',
		role: 'Global Storage',
		desc: 'Edge-based object storage with zero egress fees. Fast, global, and suited for ephemeral file distribution.',
		url: 'https://cloudflare.com',
	},
];

export const TechStack = () => {
	return (
		<section id='stack' className='py-8 border-b border-[var(--border)]'>
			<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-1.5'>
				// 03. architecture
			</p>
			<h2 className='text-2xl font-bold text-[var(--fg)] mb-5'>Tech Stack</h2>

			<div className='grid sm:grid-cols-2 gap-4'>
				{STACK_DATA.map((item) => (
					<article
						key={item.name}
						className='group p-4 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex flex-col justify-between'
					>
						<div>
							<div className='flex items-center justify-between gap-2 mb-2.5'>
								<div className='flex items-center gap-2.5'>
									<span
										className='icon-box w-7 h-7 flex items-center justify-center shrink-0'
										aria-hidden='true'
									>
										<span className='relative z-10 flex items-center justify-center'>
											{item.icon}
										</span>
									</span>
									<h3 className='text-sm font-bold text-[var(--fg)]'>
										{item.name}
									</h3>
								</div>
								<span className='text-[11px] text-[var(--fg-secondary)]'>
									{item.role}
								</span>
							</div>
							<p className='text-xs text-[var(--fg-secondary)] leading-relaxed mb-3'>
								{item.desc}
							</p>
						</div>
						<a
							href={item.url}
							target='_blank'
							rel='noreferrer'
							className='text-xs text-[var(--accent)] hover:text-[var(--fg)] self-start inline-flex items-center gap-1'
						>
							<span>docs</span>
							<span className='inline-block transition-transform duration-200 group-hover:translate-x-1'>
								-&gt;
							</span>
						</a>
					</article>
				))}
			</div>
		</section>
	);
};
