import { InjectRepository } from 'typeorm-typedi-extensions';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { CurrencyRepository } from '../repository/CurrencyRepository';

@injectable()
export class CurrencyService {
    constructor(@InjectRepository(CurrencyRepository) private readonly currencyRepository: CurrencyRepository) {}
}
