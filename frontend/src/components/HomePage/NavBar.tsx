import { useState, useEffect } from 'react';
import AstrolabeIcon from '../../resources/AstrolabeIcon';
import {
	GitHubIcon,
	LinkedInIcon,
	SunIcon,
	MoonIcon,
} from '../../resources/Icons';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		if (typeof document !== 'undefined') {
			const saved = document.documentElement.getAttribute('data-theme');
			if (saved === 'dark' || saved === 'light') return saved;
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				return 'dark';
			}
		}
		return 'light';
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	const navLinks = [
		{ name: 'about', href: '#about' },
		{ name: 'features', href: '#features' },
		{ name: 'stack', href: '#stack' },
		{ name: 'privacy', href: '#footer' },
	];

	const handleNavClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string
	) => {
		if (href.startsWith('#')) {
			e.preventDefault();
			const target = document.getElementById(href.slice(1));
			if (target) {
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				window.history.replaceState(null, '', href);
			}
			setIsOpen(false);
		}
	};

	return (
		<header className='w-full border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-50'>
			<nav
				aria-label='Primary navigation'
				className='max-w-4xl mx-auto px-4 sm:px-6 h-12 flex justify-between items-center text-sm'
			>
				<a
					href='/'
					className='group flex items-center gap-2.5 font-bold tracking-tight text-[var(--fg)] no-underline hover:text-[var(--accent)]'
				>
					<span
						className='icon-box w-7 h-7 flex items-center justify-center'
						aria-hidden='true'
					>
						<span className='relative z-10 flex items-center justify-center'>
							<AstrolabeIcon
								size={20}
								mainColor='var(--fg)'
								accentColor='var(--accent)'
								title='Silkroad Astrolabe'
							/>
						</span>
					</span>
					<span>SILK ROAD</span>
				</a>

				{/* Desktop Links */}
				<div className='hidden sm:flex items-center gap-5'>
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							onClick={(e) => handleNavClick(e, link.href)}
							className='text-[var(--fg-secondary)] hover:text-[var(--fg)] no-underline'
						>
							[{link.name}]
						</a>
					))}
					<span className='text-[var(--border)]' aria-hidden='true'>
						|
					</span>
					<a
						href='https://github.com/talha11bu'
						target='_blank'
						rel='noreferrer'
						aria-label='GitHub'
						className='icon-box w-6 h-6 text-[var(--fg-secondary)] hover:text-[var(--accent)] no-underline flex items-center justify-center'
					>
						<span className='relative z-10 flex items-center justify-center'>
							<GitHubIcon
								size={16}
								mainColor='var(--bg-surface)'
								accentColor='var(--fg)'
								title='GitHub'
							/>
						</span>
					</a>
					<a
						href='https://linkedin.com/in/talha11bu'
						target='_blank'
						rel='noreferrer'
						aria-label='LinkedIn'
						className='icon-box w-6 h-6 text-[var(--fg-secondary)] hover:text-[var(--accent)] no-underline flex items-center justify-center'
					>
						<span className='relative z-10 flex items-center justify-center'>
							<LinkedInIcon
								size={16}
								mainColor='var(--bg-surface)'
								accentColor='var(--fg)'
								title='LinkedIn'
							/>
						</span>
					</a>
					<button
						type='button'
						onClick={toggleTheme}
						className='icon-box w-6 h-6 text-[var(--fg-secondary)] hover:text-[var(--accent)] cursor-pointer bg-transparent border-0 p-0 flex items-center justify-center'
						aria-label='Toggle color theme'
						title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
					>
						<span className='relative z-10 flex items-center justify-center'>
							{theme === 'light' ? (
								<MoonIcon
									size={16}
									mainColor='var(--bg-surface)'
									accentColor='var(--fg)'
									title='Dark mode'
								/>
							) : (
								<SunIcon
									size={16}
									mainColor='var(--bg-surface)'
									accentColor='var(--accent)'
									title='Light mode'
								/>
							)}
						</span>
					</button>
				</div>

				{/* Mobile Menu Toggle */}
				<div className='flex sm:hidden items-center gap-2'>
					<button
						type='button'
						onClick={toggleTheme}
						className='icon-box w-6 h-6 text-[var(--fg-secondary)] hover:text-[var(--accent)] bg-transparent border-0 p-0 flex items-center justify-center'
						aria-label='Toggle color theme'
					>
						<span className='relative z-10 flex items-center justify-center'>
							{theme === 'light' ? (
								<MoonIcon
									size={16}
									mainColor='var(--bg-surface)'
									accentColor='var(--fg)'
									title='Dark mode'
								/>
							) : (
								<SunIcon
									size={16}
									mainColor='var(--bg-surface)'
									accentColor='var(--accent)'
									title='Light mode'
								/>
							)}
						</span>
					</button>
					<button
						type='button'
						onClick={() => setIsOpen(!isOpen)}
						className='text-[var(--fg)] bg-transparent border border-[var(--border)] px-2 py-0.5 text-xs'
						aria-expanded={isOpen}
						aria-label='Toggle navigation menu'
					>
						{isOpen ? 'close' : 'menu'}
					</button>
				</div>
			</nav>

			{/* Mobile Links */}
			{isOpen && (
				<div className='sm:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex flex-col gap-2 text-sm'>
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							onClick={(e) => handleNavClick(e, link.href)}
							className='text-[var(--fg-secondary)] hover:text-[var(--fg)] no-underline py-1'
						>
							[{link.name}]
						</a>
					))}
					<div className='flex items-center gap-3 pt-2 border-t border-[var(--border)]'>
						<a
							href='https://github.com/your-username'
							target='_blank'
							rel='noreferrer'
							className='text-xs text-[var(--fg-secondary)] hover:text-[var(--accent)] no-underline border border-[var(--border)] px-2 py-0.5'
						>
							github
						</a>
						<a
							href='https://linkedin.com/in/your-profile'
							target='_blank'
							rel='noreferrer'
							className='text-xs text-[var(--fg-secondary)] hover:text-[var(--accent)] no-underline border border-[var(--border)] px-2 py-0.5'
						>
							linkedin
						</a>
					</div>
				</div>
			)}
		</header>
	);
};

export default Navbar;
