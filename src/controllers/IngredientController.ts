import {Authorized, Body, Delete, Get, JsonController, Param, Post, Put} from 'routing-controllers';
import { Service } from 'typedi';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import IngredientService from '../service/IngredientService';
import { IngredientRequestDTO } from '../dto/IngredientRequestDTO';
import { IngredientResponseDTO } from '../dto/IngredientResponseDTO';
import { DeleteResult } from 'typeorm';

@Service()
@JsonController()
@Authorized()
export class IngredientController {
    constructor(@inject(TYPES.IngredientService) private readonly ingredientService: IngredientService) {}

    @Get('/ingredients/:dishId')
    async get(@Param('dishId') dishId: number): Promise<IngredientResponseDTO[]> {
        return this.ingredientService.findByDishid(dishId);
    }

    @Post('/ingredients')
    async save(@Body() request: IngredientRequestDTO): Promise<IngredientResponseDTO> {
        return this.ingredientService.save(request);
    }

    @Put('/ingredients')
    async update(@Body() request: IngredientRequestDTO): Promise<IngredientResponseDTO> {
        return this.ingredientService.update(request);
    }

    @Delete('/ingredients/:id')
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.ingredientService.delete(id);
    }
}
