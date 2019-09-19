import {AbstractRepository, DeleteResult, EntityRepository, UpdateResult} from 'typeorm';
import {Service} from 'typedi';
import {Ingredient} from '../entity/Ingredient';

@Service()
@EntityRepository(Ingredient)
export class IngredientRepository extends AbstractRepository<Ingredient> {
    find(): Promise<Ingredient[]> {
        return this.repository.find();
    }

    findOne(id: number): Promise<Ingredient> {
        return this.repository.findOne(id);
    }

    findByOptions(ingredient: Ingredient): Promise<Ingredient> {
        return this.repository.findOne(ingredient);
    }

    save(ingredient: Ingredient): Promise<Ingredient> {
        return this.repository.save(ingredient);
    }

    update(ingredient: Ingredient): Promise<UpdateResult> {
        return this.repository.update(ingredient.id, ingredient);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
