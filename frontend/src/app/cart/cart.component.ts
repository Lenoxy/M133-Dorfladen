import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {ProductDto} from '../../../../dto/product.dto';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    public cart: [ProductDto, number][];
    public totalPrice = 0;

    constructor(private productService: ProductService) {
    }

    async ngOnInit() {
        this.cart = await this.productService.getCart();
        console.log(this.cart);
        await this.setTotalPrice();
    }

    async addProduct(productId: string) {
        await this.productService.addProductToBasket(productId);
        this.cart = await this.productService.getCart();
        this.setTotalPrice();
    }

    async removeProduct(productId: string) {
        await this.productService.removeProductFromBasket(productId);
        this.cart = await this.productService.getCart();
        this.setTotalPrice();
    }

    setTotalPrice() {
        let totalPrice = 0;
        this.cart.forEach((tuple) => {
            console.log(tuple);
            totalPrice += (tuple[0].specialOffer ? tuple[0].specialOffer : tuple[0].normalPrice) * tuple[1];
        });
        this.totalPrice = totalPrice;
    }

}
