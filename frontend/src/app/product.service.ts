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

    public async getProductDetail(productId: number): Promise<ProductDto> {
        return this.http.get<ProductDto>(environment.api + 'item/' + productId);
    }

    public async addProductToBasket(productId: number): Promise<void> {
        return this.http.post(environment.api + 'api/cart/' + productId);
    }

    public async removeProductFromBasket(productId: number): Promise<void> {
        return this.http.delete(environment.api + 'api/cart/' + productId);
    }

}
