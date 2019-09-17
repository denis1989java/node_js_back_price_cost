import { User } from '../entity/User';

export class CredentialDTO {
    constructor(token: string, user: User) {
        this.token = token;
        this.email = user.email;
        this.id = user.id;
    }

    token: string;

    email: string;

    id: number;
}
