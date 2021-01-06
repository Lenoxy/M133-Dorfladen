import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from './product.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(private router: Router, private productService: ProductService) {
    }

    async routeToOverview() {
        await this.router.navigateByUrl('/');
    }

    async ngOnInit() {
        await this.productService.updateCartPrice();
    }

}
