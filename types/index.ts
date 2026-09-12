export interface MenuItem {
	id: string;
	name: string;
	price: number;
	type: string;
	badge: string;
	weight: string;
	stockStatus: string;
	description: string;
	imgSrc: string;
	imgAlt: string;
}

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

