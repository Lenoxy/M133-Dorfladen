import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProductService} from '../product.service';
import {ValidationDto} from '../../../../dto/validation.dto';
import {Router} from '@angular/router';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    checkoutForm: FormGroup;
    validation: ValidationDto;

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.checkoutForm = this.formBuilder.group({
            firstname: new FormControl(''),
            lastname: new FormControl(''),
            email: new FormControl(''),
        });
    }

    async onSubmit() {
        const firstname = this.checkoutForm.get('firstname').value;
        const lastname = this.checkoutForm.get('lastname').value;
        const email = this.checkoutForm.get('email').value;

        console.log(email);
        const frontendValidationAnswer = new ValidationDto(firstname, lastname, email);
        if (!frontendValidationAnswer.isValid()) {
            console.warn('frontend val');
            this.validation = frontendValidationAnswer;

        } else {
            console.log('frontend val PASSED');

            // Deep clone object in order to use the functions
            const backendValidationAnswer: ValidationDto = new ValidationDto(null, null, null);
            Object.assign(backendValidationAnswer, await this.productService.order(firstname, lastname, email));
            console.log(backendValidationAnswer);

            if (!backendValidationAnswer.isValid()) {
                console.warn('backend val');
                this.validation = backendValidationAnswer;
            } else {
                console.log('backend val PASSED');

                console.log('Order placed');
                alert('Order placed successfully');
                this.checkoutForm.reset();
                await this.router.navigateByUrl('/');
            }
        }
        console.log(this.validation);
    }

}
