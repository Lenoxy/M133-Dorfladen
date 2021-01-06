import {Injectable} from '@angular/core';
import {ProductDto} from '../../../dto/product.dto';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ValidationDto} from '../../../dto/validation.dto';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    public totalCartPrice = 0;

    constructor(private http: HttpClient) {
    }

    public async getProducts(): Promise<ProductDto[]> {
        return this.http.get<ProductDto[]>(environment.api + 'items/').toPromise();
    }

    public async getProductDetail(productId: string): Promise<ProductDto> {
        return this.http.get<ProductDto>(environment.api + 'item/' + productId).toPromise();
    }

    public async updateCartPrice() {
        this.totalCartPrice = await this.http.get<number>(environment.api + 'cart/cost/').toPromise();
    }

    public async getCart(): Promise<[ProductDto, number][]> {
        return this.http.get<[ProductDto, number][]>(environment.api + 'cart/').toPromise();
    }

    public async addProductToBasket(productId: string): Promise<void> {
        return this.http.post<void>(environment.api + 'cart/' + productId, null).toPromise();
    }

    public async removeProductFromBasket(productId: string): Promise<void> {
        return this.http.delete<void>(environment.api + 'cart/' + productId).toPromise();
    }

    public async order(firstname: string, lastname: string, email: string): Promise<ValidationDto> {
        return this.http.put<ValidationDto>(environment.api + 'checkout/', {firstname, lastname, email}).toPromise();
    }


}
