import { Component, OnInit } from '@angular/core';
import {ProductService} from '../product.service';
import {ProductDto} from '../../../../shared-types/product.dto';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(private productService: ProductService) { }

  public products: ProductDto[];

  async ngOnInit(): Promise<void> {
    console.log('fdafds');
    this.products = await this.productService.getProducts();
    console.log(this.products);
  }

}
