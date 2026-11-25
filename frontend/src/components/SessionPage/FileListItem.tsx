import { File as FileIcon, Download, Trash2 } from 'lucide-react';

interface FileListItemProps {
	fileName: string;
	onDownload: (fileName: string) => void;
	onDelete: (fileName: string) => void;
}

/** A single file row with download/delete actions. */
export const FileListItem = ({
	fileName,
	onDownload,
	onDelete,
}: FileListItemProps) => (
	<div className='group flex items-center justify-between p-3 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors'>
		<div className='flex items-center gap-3 overflow-hidden min-w-0 flex-1'>
			<div className='w-7 h-7 border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-[var(--accent)] shrink-0'>
				<FileIcon size={15} />
			</div>
			<p className='truncate text-sm text-[var(--fg)]' title={fileName}>
				{fileName}
			</p>
		</div>
		<div className='flex gap-1.5 shrink-0 ml-2'>
			<button
				type='button'
				onClick={() => onDownload(fileName)}
				className='p-1.5 border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] hover:border-[var(--accent)] cursor-pointer transition-colors'
				aria-label={`Download ${fileName}`}
				title='Download'
			>
				<Download size={14} />
			</button>
			<button
				type='button'
				onClick={() => onDelete(fileName)}
				className='p-1.5 border border-[var(--border)] bg-[var(--bg)] text-red-600 hover:border-red-600 cursor-pointer transition-colors'
				aria-label={`Delete ${fileName}`}
				title='Delete'
			>
				<Trash2 size={14} />
			</button>
		</div>
	</div>
);
