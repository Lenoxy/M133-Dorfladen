export interface ProductDto {
    id: string,
    productName: string
    specialOffer: number,
    normalPrice: number,
    // Base64 String with image
    imageName: string,
    description: string
}
