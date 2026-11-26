import { WarningIcon } from '../../resources/Icons';

interface DeleteFileModalProps {
	fileName: string;
	onConfirm: () => void;
	onCancel: () => void;
}

/** Confirmation modal for permanently deleting a file from R2. */
export const DeleteFileModal = ({
	fileName,
	onConfirm,
	onCancel,
}: DeleteFileModalProps) => (
	<div className='fixed inset-0 z-100 bg-black/70 flex items-center justify-center p-4'>
		<div className='bg-[var(--bg)] border border-[var(--border)] p-8 max-w-sm w-full text-center space-y-6'>
			<WarningIcon
				className='mx-auto'
				size={40}
				mainColor='var(--bg)'
				accentColor='#dc2626'
			/>
			<div>
				<h2 className='text-[var(--fg)] font-black uppercase tracking-widest text-lg'>
					Purge File?
				</h2>
				<p className='text-[var(--fg-secondary)] font-mono text-xs mt-2 truncate px-4'>
					{fileName}
				</p>
				<p className='text-[var(--fg-secondary)] font-mono text-[10px] mt-2 uppercase tracking-widest'>
					This action cannot be undone.
				</p>
			</div>
			<div className='flex gap-4'>
				<button
					onClick={onCancel}
					className='flex-1 py-3 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--fg)] font-mono text-xs hover:border-[var(--fg)] transition-colors uppercase tracking-widest cursor-pointer'
				>
					Cancel
				</button>
				<button
					onClick={onConfirm}
					className='flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-bold font-mono text-xs hover:bg-red-500 hover:text-black transition-colors uppercase tracking-widest cursor-pointer'
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
);
