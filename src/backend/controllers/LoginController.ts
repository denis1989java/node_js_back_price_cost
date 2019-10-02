import { Body, JsonController, Post, Session } from 'routing-controllers';
import { Service } from 'typedi';
import AuthenticationService from '../service/AuthenticationService';
import { UserCreateDTO } from '../dto/UserCreateDTO';
import { CredentialDTO } from '../dto/CredentialDTO';
import { inject } from 'inversify';
import { TYPES } from '../types';

@Service()
@JsonController('/api')
export class LoginController {
    constructor(@inject(TYPES.AuthenticationService) private readonly authenticationService: AuthenticationService) {}

    @Post('/login')
    async login(@Body() request: UserCreateDTO, @Session() session: Express.Session): Promise<string> {
        const credentialDTO: CredentialDTO = await this.authenticationService.isCredentialsValid(request);
        session.user = { email: credentialDTO.email };
        return credentialDTO.token;
    }
}
