export interface ShoppingCartType {
    sid: string;

    // ProductId, amount in basket
    products: Map<string, number>
}
