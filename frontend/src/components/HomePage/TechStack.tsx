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
		desc: 'Session lifecycle, JWT auth, and STOMP WebSocket coordination.',
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
		role: 'Build & Tooling',
		desc: 'Fast TypeScript bundling and zero-bloat asset compilation.',
		url: 'https://bun.sh',
	},
	{
		icon: (
			<React19Icon
				size={20}
				mainColor='var(--accent)'
				accentColor='var(--bg)'
				title='React 19'
			/>
		),
		name: 'React 19',
		role: 'Interface Engine',
		desc: 'Lightweight client UI with live WebSocket session updates.',
		url: 'https://react.dev',
	},
	{
		icon: (
			<CloudflareIcon
				size={20}
				mainColor='var(--bg)'
				accentColor='var(--accent)'
				title='Cloudflare R2 / S3'
			/>
		),
		name: 'Cloudflare R2',
		role: 'Object Storage',
		desc: 'S3-compatible edge storage with direct pre-signed transfers.',
		url: 'https://cloudflare.com',
	},
];

export const TechStack = () => {
	return (
		<section
			id='stack'
			className='py-14 lg:py-20 border-b border-[var(--border)]'
		>
			<div className='mb-8'>
				<p className='text-xs text-[var(--accent)] uppercase tracking-wider mb-2'>
					// 03. architecture
				</p>
				<h2 className='text-2xl sm:text-3xl font-bold text-[var(--fg)]'>
					Tech Stack
				</h2>
			</div>

			{/* Horizontal Architecture Flow */}
			<div className='mb-6 p-4 bg-[var(--surface)] border border-[var(--border)] text-xs flex flex-wrap items-center justify-between gap-2'>
				<span className='text-[var(--fg)] font-bold'>CLIENT</span>
				<span className='text-[var(--accent)]'>-&gt;</span>
				<span className='text-[var(--fg)] font-bold'>SPRING API (JWT/WS)</span>
				<span className='text-[var(--accent)]'>-&gt;</span>
				<span className='text-[var(--fg)] font-bold'>PRE-SIGNED URL</span>
				<span className='text-[var(--accent)]'>-&gt;</span>
				<span className='text-[var(--fg)] font-bold'>R2 / S3 BUCKET</span>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
				{STACK_DATA.map((item) => (
					<article
						key={item.name}
						className='group p-5 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex flex-col justify-between'
					>
						<div>
							<div className='flex items-center gap-2.5 mb-3'>
								<span
									className='icon-box w-7 h-7 flex items-center justify-center shrink-0'
									aria-hidden='true'
								>
									<span className='relative z-10 flex items-center justify-center'>
										{item.icon}
									</span>
								</span>
								<div>
									<h3 className='text-sm font-bold text-[var(--fg)] leading-tight'>
										{item.name}
									</h3>
									<span className='text-[11px] text-[var(--fg-muted)]'>
										{item.role}
									</span>
								</div>
							</div>
							<p className='text-xs text-[var(--fg-secondary)] leading-relaxed mb-4'>
								{item.desc}
							</p>
						</div>
						<a
							href={item.url}
							target='_blank'
							rel='noreferrer'
							className='text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] self-start inline-flex items-center gap-1'
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
