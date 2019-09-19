import { Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Service } from 'typedi';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import PurchaseService from '../service/PurchaseService';
import { PurchaseResponseDTO } from '../dto/PurchaseResponseDTO';
import { PurchaseCreateDTO } from '../dto/PurchaseCreateDTO';
import { User } from '../entity/User';
import { PurchaseUpdateDTO } from '../dto/PurchaseUpdateDTO';
import { DeleteResult } from 'typeorm';

@Service()
@JsonController()
export class PurchaseController {
    constructor(@inject(TYPES.PurchaseService) private readonly purchaseService: PurchaseService) {}

    @Get('/purchases/:userId')
    find(@Param('userId') userId: number): Promise<PurchaseResponseDTO[]> {
        return this.purchaseService.find(userId);
    }

    @Get('/purchases/:id')
    findOne(@Param('id') id: number): Promise<PurchaseResponseDTO> {
        return this.purchaseService.findOne(id);
    }

    @Post('/purchases')
    async save(@Body() request: PurchaseCreateDTO, @CurrentUser() user: User): Promise<PurchaseResponseDTO> {
        return this.purchaseService.save(request, user);
    }

    @Put('/purchases')
    update(@Body() request: PurchaseUpdateDTO, @CurrentUser() user: User): Promise<PurchaseResponseDTO> {
        return this.purchaseService.update(request, user);
    }

    @Delete('/purchases/:id')
    delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.purchaseService.delete(id);
    }
}
