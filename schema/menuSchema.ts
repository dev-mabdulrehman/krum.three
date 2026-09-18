import z from 'zod';

export const imgSchema = z.object({
	src: z.string().min(1, 'Image source URL is required'),
	alt: z.string().min(1, 'Image alt text is required'),
});

export const menuSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	price: z
		.number({ message: 'Price must be a valid number' })
		.min(1, 'Price must be greater than 0'),
	weight: z.string().min(1, 'Weight is required'),
	description: z.string().min(1, 'Description is required'),
	stockStatus: z.string().min(1, 'Stock status is required'),
	badge: z.string().optional(),
	imgs: z.array(imgSchema).optional(),
	slug: z.string().min(1, 'Slug is required'),
});

export default menuSchema;
