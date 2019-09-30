import { InjectRepository } from 'typeorm-typedi-extensions';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { CurrencyRepository } from '../repository/CurrencyRepository';
import { Currency } from '../entity/Currency';
import { fromCurrencyToCurrencyResponseDTO } from '../mapper/CurrencyMapper';
import { CurrencyResponseDTO } from '../dto/CurrencyResponseDTO';

@injectable()
export class CurrencyService {
    constructor(@InjectRepository(CurrencyRepository) private readonly currencyRepository: CurrencyRepository) {}

    async find(): Promise<CurrencyResponseDTO[]> {
        const currencies: Currency[] = await this.currencyRepository.find();
        return currencies.map(currency => fromCurrencyToCurrencyResponseDTO(currency));
    }
}
