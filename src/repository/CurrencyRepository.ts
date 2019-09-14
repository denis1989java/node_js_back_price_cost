import { AbstractRepository, DeleteResult, EntityRepository, UpdateResult } from 'typeorm';
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

    saveAll(currencies: Currency[]): Promise<Currency[]> {
        return this.repository.save(currencies);
    }

    save(currency: Currency): Promise<Currency> {
        return this.repository.save(currency);
    }

    update(currency: Currency): Promise<UpdateResult> {
        return this.repository.update(currency.id, currency);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
