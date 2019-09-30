import {Authorized, Body, CurrentUser, Delete, JsonController, Param, Post, Put} from 'routing-controllers';
import { Service } from 'typedi';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { User } from '../entity/User';
import DishService from '../service/DishService';
import { DishCreateDTO } from '../dto/DishCreateDTO';
import { DishResponseDTO } from '../dto/DishResponseDTO';
import { DishUpdateDTO } from '../dto/DishUpdateDTO';
import { DeleteResult } from 'typeorm';

@Service()
@JsonController()
@Authorized()
export class DishController {
    constructor(@inject(TYPES.DishService) private readonly dishService: DishService) {}

    @Post('/dishes')
    async save(@Body() request: DishCreateDTO, @CurrentUser() user: User): Promise<DishResponseDTO> {
        return this.dishService.save(request, user);
    }

    @Put('/dishes')
    async update(@Body() request: DishUpdateDTO): Promise<DishResponseDTO> {
        return this.dishService.update(request);
    }

    @Delete('/dishes/:id')
    delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.dishService.delete(id);
    }
}
