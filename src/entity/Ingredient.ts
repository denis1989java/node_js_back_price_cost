import { Column, Entity, ManyToOne } from 'typeorm';
import { Purchase } from './Purchase';
import { Dish } from './Dish';

@Entity()
export class Ingredient extends Purchase {
    @Column()
    quantity: number;

    @ManyToOne(() => Dish, dish => dish.ingredients)
    dish: Dish;
}
