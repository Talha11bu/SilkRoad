import { Users, X } from 'lucide-react';
import { UserList } from './UserList';

interface MobileDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	users: string[];
	clientUsername: string;
}

/** Mobile slide-in drawer showing connected agents. */
export const MobileDrawer = ({
	isOpen,
	onClose,
	users,
	clientUsername,
}: MobileDrawerProps) => {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				className='md:hidden fixed inset-0 bg-black/70 z-40'
			/>

			{/* Drawer */}
			<div className='md:hidden fixed inset-y-0 right-0 w-64 bg-[var(--bg)] border-l border-[var(--border)] z-50 p-6 flex flex-col'>
				<div className='flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4'>
					<h2 className='text-xs font-bold uppercase tracking-widest text-[var(--accent)] flex items-center gap-2'>
						<Users size={16} /> Agents ({users.length})
					</h2>
					<button
						onClick={onClose}
						className='p-1 border border-[var(--border)] hover:border-[var(--fg)]'
					>
						<X size={18} className='text-[var(--fg-secondary)]' />
					</button>
				</div>

				<UserList users={users} clientUsername={clientUsername} />
			</div>
		</>
	);
};
