import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../product.service';
import {ProductDto} from '../../../../dto/product.dto';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
    ) {
    }

    public product: ProductDto;

    async ngOnInit() {
        const productIdFromRoute = this.route.snapshot.paramMap.get('productId');
        this.product = await this.productService.getProductDetail(productIdFromRoute);
    }

    addToBasket() {
        this.productService.addProductToBasket(this.product.id);
    }

}
