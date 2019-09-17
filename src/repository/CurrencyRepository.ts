import { AbstractRepository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { Currency } from '../entity/Currency';

@Service()
@EntityRepository(Currency)
export class CurrencyRepository extends AbstractRepository<Currency> {
    find(): Promise<Currency[]> {
        return this.repository.find();
    }

    findOne(code: string): Promise<Currency> {
        return this.repository.findOne({ code: code });
    }
}
