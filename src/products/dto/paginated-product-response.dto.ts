import { ProductResponseDto } from "./product-response.dto";

export class PaginatedProductsResponseDto {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    products: ProductResponseDto[];
}