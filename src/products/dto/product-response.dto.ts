export class ProductResponseDto {
    id: string;
    title: string;
    price: number;
    description?: string;
    slug: string;
    stock: number;
    sizes: string[];
    gender: string;
    tags: string[];
    images: string[]; // Solo las URLs
}