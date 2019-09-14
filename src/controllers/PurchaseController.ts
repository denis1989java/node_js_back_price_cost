import { Get, JsonController, Param } from 'routing-controllers';
import { Service } from 'typedi';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import PurchaseService from '../service/PurchaseService';
import { PurchaseResponseDTO } from '../dto/PurchaseResponseDTO';

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
}
