import { useState, useRef } from 'react';
import { Upload, Search, File as FileIcon, Loader2, Archive } from 'lucide-react';
import {
	getUploadUrl,
	uploadToR2,
	confirmUpload,
	getDownloadUrl,
	downloadZip,
	deleteSessionFile,
} from '../../api/fileApi';
import { FileListItem } from './FileListItem';
import { DeleteFileModal } from './DeleteFileModal';

interface FilePanelProps {
	sessionId: string;
	password?: string;
	files: string[];
}

export const FilePanel = ({ sessionId, password, files }: FilePanelProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [fileToDelete, setFileToDelete] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const filteredFiles = files.filter((f) =>
		f.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		setUploadError(null);
		setIsUploading(true);

		try {
			const token = localStorage.getItem('silk_road_jwt');
			if (!token) throw new Error('No authentication token found');

			const contentType = selectedFile.type || 'application/octet-stream';
			const { url, fileKey } = await getUploadUrl(
				sessionId,
				selectedFile.name,
				contentType,
				token
			);

			await uploadToR2(url, selectedFile);
			await confirmUpload(
				sessionId,
				selectedFile.name,
				fileKey,
				selectedFile.size,
				token
			);
		} catch (error) {
			console.error('Upload failed', error);
			setUploadError(
				error instanceof Error ? error.message : 'File upload failed.'
			);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};

	const handleDownload = async (fileName: string) => {
		try {
			const token = localStorage.getItem('silk_road_jwt');
			if (!token) return;

			const url = await getDownloadUrl(sessionId, fileName, token);
			if (url) {
				const link = document.createElement('a');
				link.href = url;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		} catch (error) {
			console.error('Download failed', error);
		}
	};

	const handleDownloadAll = async () => {
		try {
			const token = localStorage.getItem('silk_road_jwt');
			if (!token) return;

			const blob = await downloadZip(sessionId, password, token);
			const blobUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = `SilkRoad_${sessionId}_Archive.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Zip download failed', error);
		}
	};

	const handleDelete = async () => {
		if (!fileToDelete) return;
		try {
			await deleteSessionFile(sessionId, fileToDelete);
		} catch (error) {
			console.error('Delete failed', error);
		} finally {
			setFileToDelete(null);
		}
	};

	return (
		<main className='flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col'>
			{/* HIDDEN FILE INPUT */}
			<input
				type='file'
				className='hidden'
				ref={fileInputRef}
				onChange={handleUpload}
			/>

			{/* Search & Upload Row */}
			<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 w-full'>
				<div className='relative flex-1'>
					<Search
						size={15}
						className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-secondary)]'
					/>
					<input
						type='text'
						placeholder='search files...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full bg-[var(--bg-surface)] border border-[var(--border)] pl-9 pr-3 py-2 text-xs text-[var(--fg)] outline-none focus:border-[var(--accent)] placeholder:text-[var(--fg-secondary)]'
					/>
				</div>

				<button
					type='button'
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading}
					className='shrink-0 inline-flex items-center justify-center gap-2 bg-[var(--fg)] text-[var(--bg)] border border-[var(--fg)] px-4 py-2 font-bold text-xs uppercase tracking-wider hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-50 cursor-pointer'
				>
					{isUploading ? (
						<Loader2 size={15} className='animate-spin' />
					) : (
						<Upload size={15} />
					)}
					<span>{isUploading ? 'uploading...' : 'upload_file'}</span>
				</button>
			</div>

			{uploadError && (
				<div className='mb-4 p-2.5 border border-red-600 text-red-600 text-xs'>
					error: {uploadError}
				</div>
			)}

			{/* Download All ZIP */}
			{files.length > 0 && (
				<div className='flex justify-between items-center mb-4'>
					<span className='text-xs text-[var(--fg-secondary)]'>
						files ({files.length})
					</span>
					<button
						type='button'
						onClick={handleDownloadAll}
						className='inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)] border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] px-3 py-1.5 transition-colors cursor-pointer'
					>
						<Archive size={13} />
						<span>download_all (.zip)</span>
					</button>
				</div>
			)}

			{/* File List / Upload Drop Area */}
			<div className='flex-1 flex flex-col gap-2'>
				{files.length === 0 ? (
					<button
						type='button'
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploading}
						className='w-full flex-1 min-h-64 flex flex-col items-center justify-center text-[var(--fg-secondary)] bg-[var(--bg-surface)] border border-dashed border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors cursor-pointer p-8'
					>
						<FileIcon size={36} className='mb-3 text-[var(--accent)]' />
						<p className='text-sm font-bold text-[var(--fg)] uppercase tracking-wider'>
							{isUploading ? 'Uploading file...' : 'Click to upload a file'}
						</p>
						<p className='text-xs text-[var(--fg-secondary)] mt-1'>
							Files stream directly via pre-signed object storage
						</p>
					</button>
				) : filteredFiles.length === 0 ? (
					<div className='text-center text-[var(--fg-secondary)] text-xs uppercase py-12 border border-[var(--border)] bg-[var(--bg-surface)]'>
						No files match query
					</div>
				) : (
					filteredFiles.map((file, idx) => (
						<FileListItem
							key={idx}
							fileName={file}
							onDownload={handleDownload}
							onDelete={setFileToDelete}
						/>
					))
				)}
			</div>

			{/* DELETE CONFIRMATION MODAL */}
			{fileToDelete && (
				<DeleteFileModal
					fileName={fileToDelete}
					onConfirm={handleDelete}
					onCancel={() => setFileToDelete(null)}
				/>
			)}
		</main>
	);
};
