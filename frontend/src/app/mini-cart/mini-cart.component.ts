import {Component} from '@angular/core';
import {ProductService} from '../product.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-mini-cart',
    templateUrl: './mini-cart.component.html',
    styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent {

    constructor(
        public productService: ProductService,
        private router: Router
    ) {
    }

    async routeToCart() {
        await this.router.navigateByUrl('/cart');
    }
}
