import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {DetailComponent} from './detail/detail.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutComponent} from './checkout/checkout.component';

const routes: Routes = [
    {path: '', component: OverviewComponent},
    {path: 'detail/:productId', component: DetailComponent},
    {path: 'cart', component: CartComponent},
    {path: 'checkout', component: CheckoutComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
