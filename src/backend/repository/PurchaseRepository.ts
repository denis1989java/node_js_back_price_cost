import { AbstractRepository, DeleteResult, EntityRepository, UpdateResult } from 'typeorm';
import { Service } from 'typedi';
import { Purchase } from '../entity/Purchase';
import { User } from '../entity/User';

@Service()
@EntityRepository(Purchase)
export class PurchaseRepository extends AbstractRepository<Purchase> {
    find(user: User): Promise<Purchase[]> {
        return this.repository.find({ user: user });
    }

    findOne(id: number): Promise<Purchase> {
        return this.repository.findOne(id);
    }

    save(purchase: Purchase): Promise<Purchase> {
        return this.repository.save(purchase);
    }

    update(purchase: Purchase): Promise<UpdateResult> {
        return this.repository.update(purchase.id, purchase);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
