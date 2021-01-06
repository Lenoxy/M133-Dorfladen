export class ValidationDto {
    public firstname: string[] = [];
    public lastname: string[] = [];
    public email: string[] = [];

    constructor(firstname: string, lastname: string, email: string) {

        if (firstname == undefined || firstname.length <= 2) {
            this.firstname.push('length');
        }

        if (lastname == undefined || lastname.length <= 2) {
            this.lastname.push('length');
        }

        if (!email) {
            this.email.push('length');
        }
        if (email && !email.includes('@')) {
            this.email.push('at-missing');
        }
        if (email && !email.includes('.')) {
            this.email.push('dot-missing');
        }
    }

    isValid(): boolean {
        return this.firstname.length === 0 && this.lastname.length === 0 && this.email.length === 0;
    }
}
