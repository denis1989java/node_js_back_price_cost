import { AbstractRepository, DeleteResult, EntityRepository, UpdateResult } from 'typeorm';
import { Service } from 'typedi';
import { Dish } from '../entity/Dish';

@Service()
@EntityRepository(Dish)
export class DishRepository extends AbstractRepository<Dish> {
    findOne(id: number): Promise<Dish> {
        return this.repository.findOne(id, { relations: ['ingredients'] });
    }

    save(dish: Dish): Promise<Dish> {
        return this.repository.save(dish);
    }

    update(dish: Dish): Promise<UpdateResult> {
        return this.repository.update(dish.id, dish);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
