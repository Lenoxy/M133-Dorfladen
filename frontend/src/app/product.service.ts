import {Injectable} from '@angular/core';
import {ProductDto} from '../../../shared-types/product.dto';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) {
    }

    public async getProducts(): Promise<ProductDto[]> {
        return this.http.get<ProductDto[]>(environment.api + 'items').toPromise();
    }

    public async getProductDetail(productId: string): Promise<ProductDto> {
        return this.http.get<ProductDto>(environment.api + 'item/' + productId).toPromise();
    }

    public async getCartPrice(): Promise<number> {
        return this.http.get<number>(environment.api + 'cart').toPromise();
    }

    public async addProductToBasket(productId: string): Promise<void> {
        return this.http.post<void>(environment.api + 'cart/' + productId, null).toPromise();
    }

    public async removeProductFromBasket(productId: number): Promise<void> {
        return this.http.delete<void>(environment.api + 'cart/' + productId).toPromise();
    }

}
