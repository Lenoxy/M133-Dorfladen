import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../product.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    checkoutForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
    ) {
        this.checkoutForm = this.formBuilder.group({
            firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
            lastname: new FormControl('', [Validators.required, Validators.minLength(2)]),
            email: new FormControl('', [Validators.required, Validators.email]),
        });
    }

    ngOnInit(): void {

    }

    async onSubmit() {
        const firstname = this.checkoutForm.get('firstname').value;
        const lastname = this.checkoutForm.get('lastname').value;
        const email = this.checkoutForm.get('email').value;

        this.productService.order(firstname, lastname, email).then((answer) => {
            console.log(answer);
        }).catch((answer) => {
            console.log(answer);
        });

        this.checkoutForm.reset();

    }

}
