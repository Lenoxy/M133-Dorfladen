import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {ProductDto} from '../../../../dto/product.dto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router) { }

  public products: ProductDto[];

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getProducts();
    console.log(this.products);
  }

  navigateToDetail(id: string){
    this.router.navigate(['detail', id]);
  }

}
