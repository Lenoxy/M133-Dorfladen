export interface ShoppingCart {
    sid: string;

    // ProductId, amount in basket
    products: Map<string, number>
}
