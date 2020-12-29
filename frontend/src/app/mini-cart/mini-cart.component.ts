import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-mini-cart',
    templateUrl: './mini-cart.component.html',
    styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit {

    constructor(
        private productService: ProductService,
        private router: Router
    ) {
    }

    public price: number;

    async ngOnInit() {
        this.price = await this.productService.getCartPrice();
    }

    routeToCart() {
        this.router.navigateByUrl('/cart');
    }
}
