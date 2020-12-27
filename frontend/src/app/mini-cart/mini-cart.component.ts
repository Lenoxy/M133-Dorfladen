import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';

@Component({
    selector: 'app-mini-cart',
    templateUrl: './mini-cart.component.html',
    styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit {

    constructor(
        private productService: ProductService
    ) {
    }

    public price: number;

    async ngOnInit() {
        this.price = await this.productService.getCartPrice();
        console.log(this.price);
    }
}
