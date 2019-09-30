import { Authorized, Delete, Get, JsonController, Param } from 'routing-controllers';
import { Service } from 'typedi';
import UserService from '../service/UserService';
import { DeleteResult } from 'typeorm';
import { UserResponseDTO } from '../dto/UserResponseDTO';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';

@Service()
@JsonController()
@Authorized()
export class UserController {
    constructor(@inject(TYPES.UserService) private readonly userService: UserService) {}

    @Get('/users/:id')
    findOne(@Param('id') id: number): Promise<UserResponseDTO> {
        return this.userService.findOne(id);
    }

    @Delete('/users/:id')
    delete(@Param('id') id: number): Promise<DeleteResult> {
        //todo implement not deleting - status changing
        return this.userService.delete(id);
    }

    //todo implement password changing
}
