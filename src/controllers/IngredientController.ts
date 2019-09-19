import {Body, Delete, JsonController, Param, Post, Put} from 'routing-controllers';
import {Service} from 'typedi';
import {inject} from 'inversify';
import {TYPES} from '../../types';
import 'reflect-metadata';
import IngredientService from '../service/IngredientService';
import {IngredientRequestDTO} from '../dto/IngredientRequestDTO';
import {IngredientResponseDTO} from '../dto/IngredientResponseDTO';
import {DeleteResult} from "typeorm";

@Service()
@JsonController()
export class IngredientController {
    constructor(@inject(TYPES.IngredientService) private readonly ingredientService: IngredientService) {
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
