import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import UserService from '../service/UserService';
import { UserResponseDTO } from '../dto/UserResponseDTO';
import { UserCreateDTO } from '../dto/UserCreateDTO';
import { inject } from 'inversify';
import { TYPES } from '../../types';

@Service()
@JsonController()
export class RegistrationController {
    constructor(@inject(TYPES.UserService) private readonly userService: UserService) {}

    @Post('/registration')
    async registration(@Body() request: UserCreateDTO): Promise<UserResponseDTO> {
        return this.userService.save(request);
    }
}
