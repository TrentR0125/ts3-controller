
export class SignInCommand {
    constructor(
        public emailOrPin: string,
        public password: string
    ) {}
}