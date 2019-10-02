import { Authorized, Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { CurrencyService } from '../service/CurrencyService';
import { CurrencyResponseDTO } from '../dto/CurrencyResponseDTO';

@Service()
@JsonController('/api')
@Authorized()
export class CurrencyController {
    constructor(@inject(TYPES.CurrencyService) private readonly currencyService: CurrencyService) {}

    @Get('/currencies')
    find(): Promise<CurrencyResponseDTO[]> {
        return this.currencyService.find();
    }
}
