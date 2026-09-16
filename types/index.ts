export interface CartItem {
	cartId: string;
	id: string;
	name: string;
	price: number;
	qty: number;
	img: string;
	isBox?: boolean;
}

export interface BoxSlot {
	name: string;
	img: string;
}

export interface ImageUploadItem {
	imgFile?: string | File;
	imgAlt: string;
}

export interface MixedImageData {
	id: string;
	file?: File;
	previewUrl: string;
	alt: string;
	isExisting: boolean;
}

export interface Imgs {
	src: string;
	alt: string;
}
export interface MenuItem {
	id: string;
	name: string;
	price: number;
	badge?: string;
	weight: string;
	stockStatus: string;
	description: string;
	imgs: Imgs[];
	slug: string;
}

export interface MultiImageUploadProps {
	images?: Imgs[];
	onChange?: (imagesData: MixedImageData[], coverIndex: number) => void;
	maxImgs?: number;
	maxImgSize?: number;
}
