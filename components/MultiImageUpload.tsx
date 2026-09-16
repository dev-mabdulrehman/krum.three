'use client';

import { MixedImageData, MultiImageUploadProps } from '@/types';
import { AlertCircle, Image as ImageIcon, Star, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export const MultiImageUpload = ({
	images = [],
	onChange,
	maxImgs = 4,
	maxImgSize = 1,
}: MultiImageUploadProps) => {
	const [imagesData, setImagesData] = useState<MixedImageData[]>([]);
	const [coverIndex, setCoverIndex] = useState<number>(0);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Keep track of parent onChange without triggering effects
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Keep track of images state in ref to clean up ObjectURLs on unmount
	const imagesDataRef = useRef(imagesData);
	useEffect(() => {
		imagesDataRef.current = imagesData;
	}, [imagesData]);

	// Sync helper: Updates local state and notifies parent directly
	const updateAndNotify = (
		newImagesData: MixedImageData[],
		newCoverIndex: number,
	) => {
		setImagesData(newImagesData);
		setCoverIndex(newCoverIndex);
		if (onChangeRef.current) {
			onChangeRef.current(newImagesData, newCoverIndex);
		}
	};

	// Initialize state with existing remote images when incoming images prop actually changes
	const prevImagesJsonRef = useRef<string>('');
	useEffect(() => {
		const currentImagesJson = JSON.stringify(images);
		if (prevImagesJsonRef.current === currentImagesJson) return;
		prevImagesJsonRef.current = currentImagesJson;

		if (images.length > 0) {
			const initialList: MixedImageData[] = images.map((img, index) => ({
				id: `existing-${index}-${img.src}`,
				previewUrl: img.src,
				alt: img.alt || '',
				isExisting: true,
			}));
			setImagesData(initialList);
			setCoverIndex(0);
			if (onChangeRef.current) {
				onChangeRef.current(initialList, 0);
			}
		} else {
			setImagesData([]);
			setCoverIndex(0);
			if (onChangeRef.current) {
				onChangeRef.current([], 0);
			}
		}
	}, [images]);

	// Cleanup Blob Object URLs ONLY on unmount
	useEffect(() => {
		return () => {
			imagesDataRef.current.forEach(item => {
				if (!item.isExisting && item.previewUrl) {
					URL.revokeObjectURL(item.previewUrl);
				}
			});
		};
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrorMsg(null);
		if (!e.target.files) return;

		const incomingFiles = Array.from(e.target.files);

		if (imagesData.length >= maxImgs) {
			setErrorMsg(`You can only upload a maximum of ${maxImgs} images.`);
			e.target.value = '';
			return;
		}

		const validFiles: File[] = [];
		let sizeLimitExceeded = false;
		let duplicateFound = false;

		for (const file of incomingFiles) {
			if (file.size > maxImgSize * 1024 * 1024) {
				sizeLimitExceeded = true;
				continue;
			}

			const isDuplicate = imagesData.some(
				existing =>
					existing.file &&
					existing.file.name === file.name &&
					existing.file.size === file.size &&
					existing.file.lastModified === file.lastModified,
			);

			if (isDuplicate) {
				duplicateFound = true;
				continue;
			}

			validFiles.push(file);
		}

		const availableSlots = maxImgs - imagesData.length;
		let allowedFiles = validFiles;

		if (validFiles.length > availableSlots) {
			allowedFiles = validFiles.slice(0, availableSlots);
			setErrorMsg(
				`Only ${allowedFiles.length} image(s) added. Maximum allowed limit is ${maxImgs}.`,
			);
		} else if (sizeLimitExceeded) {
			setErrorMsg(
				`Some files were skipped because they exceed ${maxImgSize} MB.`,
			);
		} else if (duplicateFound && validFiles.length === 0) {
			setErrorMsg('Duplicate files were skipped.');
		}

		if (allowedFiles.length === 0) {
			e.target.value = '';
			return;
		}

		const newItems: MixedImageData[] = allowedFiles.map(file => ({
			id: `new-${Date.now()}-${file.name}`,
			file,
			previewUrl: URL.createObjectURL(file),
			alt: file.name.split('.')[0] || '',
			isExisting: false,
		}));

		const updatedList = [...imagesData, ...newItems];
		updateAndNotify(updatedList, coverIndex);
		e.target.value = '';
	};

	const handleRemoveImage = (indexToRemove: number) => {
		setErrorMsg(null);
		const target = imagesData[indexToRemove];

		if (!target.isExisting && target.previewUrl) {
			URL.revokeObjectURL(target.previewUrl);
		}

		const updatedList = imagesData.filter(
			(_, index) => index !== indexToRemove,
		);

		let newCoverIndex = coverIndex;
		if (indexToRemove === coverIndex) {
			newCoverIndex = 0;
		} else if (indexToRemove < coverIndex) {
			newCoverIndex = coverIndex - 1;
		}

		updateAndNotify(updatedList, newCoverIndex);
	};

	const handleAltChange = (index: number, newAlt: string) => {
		const updatedList = imagesData.map((item, i) =>
			i === index ? { ...item, alt: newAlt } : item,
		);
		updateAndNotify(updatedList, coverIndex);
	};

	const handleSetCover = (index: number) => {
		updateAndNotify(imagesData, index);
	};

	const isMaxReached = imagesData.length >= maxImgs;

	return (
		<div className='space-y-3'>
			<div className='flex justify-between items-center'>
				<label className='block font-semibold text-gray-600 text-xs'>
					Item Images ({imagesData.length}/{maxImgs})
				</label>
				{imagesData.length > 0 && (
					<span className='text-[10px] text-gray-400'>
						Star = default image | Edit alt text below
					</span>
				)}
			</div>

			<div className='flex flex-wrap items-center gap-3'>
				{imagesData.map((item, index) => {
					const isCover = coverIndex === index;

					return (
						<div
							key={item.id}
							className={`group relative border rounded w-16 h-16 overflow-hidden shrink-0 transition-all ${
								isCover
									? 'ring-2 ring-blue-500 border-transparent'
									: ''
							}`}
						>
							<img
								src={item.previewUrl}
								alt={item.alt || `Preview ${index + 1}`}
								className='w-full h-full object-cover'
							/>

							{/* Set as Cover / Default Button */}
							<button
								type='button'
								onClick={() => handleSetCover(index)}
								title={
									isCover ? 'Default Image' : 'Set as default'
								}
								className={`top-1 left-1 absolute p-1 rounded-full transition ${
									isCover
										? 'bg-blue-600 text-white opacity-100'
										: 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-yellow-500'
								}`}
							>
								<Star
									size={10}
									fill={isCover ? 'currentColor' : 'none'}
								/>
							</button>

							{/* Delete Image Button */}
							<button
								type='button'
								onClick={() => handleRemoveImage(index)}
								className='top-1 right-1 absolute bg-black/60 hover:bg-red-600 opacity-0 group-hover:opacity-100 p-0.5 rounded-full text-white transition'
							>
								<X size={12} />
							</button>

							{isCover && (
								<div className='right-0 bottom-0 left-0 absolute bg-blue-600 py-0.5 font-bold text-[9px] text-white text-center leading-none pointer-events-none'>
									Default
								</div>
							)}
						</div>
					);
				})}

				{imagesData.length === 0 && (
					<div className='flex justify-center items-center bg-gray-100 border rounded w-16 h-16 text-gray-400 shrink-0'>
						<ImageIcon size={24} />
					</div>
				)}

				<label
					className={`flex items-center self-stretch gap-2 px-3 py-2 border rounded font-semibold text-xs transition ${
						isMaxReached
							? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
							: 'bg-gray-50 hover:bg-gray-100 text-gray-700 cursor-pointer'
					}`}
				>
					<Upload size={16} /> Choose Files
					<input
						type='file'
						accept='image/*'
						multiple
						disabled={isMaxReached}
						className='hidden'
						onChange={handleFileChange}
					/>
				</label>
			</div>

			{/* Alt Text Controls */}
			{imagesData.length > 0 && (
				<div className='space-y-2 pt-2 border-gray-100 border-t'>
					{imagesData.map((item, index) => (
						<div
							key={item.id}
							className='flex items-center gap-2 bg-gray-50 p-2 border border-gray-200 rounded'
						>
							<img
								src={item.previewUrl}
								alt={`Thumbnail ${index + 1}`}
								className='rounded w-8 h-8 object-cover shrink-0'
							/>
							<div className='flex-1 min-w-0'>
								<input
									type='text'
									placeholder={`Alt text for image ${index + 1}...`}
									value={item.alt}
									onChange={e =>
										handleAltChange(index, e.target.value)
									}
									className='bg-white px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-xs'
								/>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Error Message */}
			{errorMsg && (
				<div className='flex items-center gap-1.5 text-red-500 text-xs'>
					<AlertCircle size={14} />
					<span>{errorMsg}</span>
				</div>
			)}
		</div>
	);
};
