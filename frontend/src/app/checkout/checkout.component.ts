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

    deepCloneValidationDto(toCloneDto: ValidationDto): ValidationDto {
        const clonedDto = new ValidationDto(null, null, null);
        return Object.assign(clonedDto, toCloneDto);
    }

    async order() {
        this.checkoutForm.reset();
        await this.productService.updateCartPrice();
        alert('Order placed successfully');
        await this.router.navigateByUrl('/');
    }

    async onSubmit() {
        const firstname = this.checkoutForm.get('firstname').value;
        const lastname = this.checkoutForm.get('lastname').value;
        const email = this.checkoutForm.get('email').value;

        console.log(email);
        const frontendValidationAnswer = new ValidationDto(firstname, lastname, email);
        if (!frontendValidationAnswer.isValid()) {
            console.warn('Failed frontend validation');
            this.validation = frontendValidationAnswer;
        } else {
            console.log('Passed frontend validation');
            // Deep clone object in order to use the functions
            const backendValidationAnswer = this.deepCloneValidationDto(await this.productService.order(firstname, lastname, email));
            if (!backendValidationAnswer.isValid()) {
                console.warn('Failed backend validation');
                this.validation = backendValidationAnswer;
            } else {
                console.log('Passed backend validation');
                await this.order();
            }
        }
    }


}
